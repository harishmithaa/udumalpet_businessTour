const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('./emailHelper');

const sendBlogNewsletter = async (blog) => {
  try {
    const subscribers = await NewsletterSubscriber.find();
    console.log(`[Newsletter] Found ${subscribers.length} subscribers to notify for approved blog "${blog.title}"`);
    
    if (subscribers.length === 0) return;

    for (const subscriber of subscribers) {
      // 1. Send Email Notification
      try {
        await sendEmail({
          to: subscriber.email,
          subject: `New Story: "${blog.title}" is now live on UBT!`,
          text: `Hello,\n\nA new story "${blog.title}" has been published in the category "${blog.category}" by ${blog.authorName}.\n\nPreview:\n"${blog.content.substring(0, 200)}..."\n\nRead the full story here: http://localhost:5173/blogs/${blog._id}\n\nBest regards,\nUBT Team`,
          html: `
            <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin: 0 auto;">
              <h2 style="color: #027244; font-size: 22px; font-weight: 900; border-bottom: 2px solid #e6f7f0; padding-bottom: 12px; margin-top: 0;">Udumalpet Business Tour</h2>
              <p style="font-size: 11px; line-height: 1.5; font-weight: bold; color: #718096; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">NEW LOCAL ARTICLE PUBLISHED</p>
              <h1 style="color: #001c41; font-size: 20px; font-weight: 800; line-height: 1.4; margin-top: 10px; margin-bottom: 8px;">${blog.title}</h1>
              <p style="font-size: 12px; color: #718096; margin-top: 0; margin-bottom: 20px;">Category: <strong style="color: #027244;">${blog.category}</strong> &bull; Written by: <strong>${blog.authorName}</strong></p>
              <div style="background-color: #f7fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 15px 0; color: #4a5568; font-size: 13.5px; line-height: 1.6; font-style: italic;">
                "${blog.content.substring(0, 200)}..."
              </div>
              <p style="margin-top: 25px; text-align: center;">
                <a href="http://localhost:5173/blogs/${blog._id}" style="background-color: #027244; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 2px 4px rgba(2, 114, 68, 0.2);">Read Full Article</a>
              </p>
              <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 30px 0;" />
              <p style="font-size: 10px; color: #a0aec0; text-align: center; margin: 0; line-height: 1.4;">
                You are receiving this email because you subscribed to the Udumalpet Business Tour newsletter.
                <br/>
                If you no longer wish to receive these notifications, you can unsubscribe at any time.
              </p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error(`[Newsletter] Failed to email subscriber ${subscriber.email}:`, emailErr.message);
      }

      // 2. Send In-App Notification (If subscriber is a registered user)
      try {
        const user = await User.findOne({ email: subscriber.email });
        if (user) {
          await Notification.create({
            userId: user._id,
            title: `New Blog Published`,
            message: `A new article "${blog.title}" has been approved in "${blog.category}".`,
            type: 'broadcast'
          });
        }
      } catch (notifErr) {
        console.error(`[Newsletter] Failed to push notification for ${subscriber.email}:`, notifErr.message);
      }
    }
  } catch (err) {
    console.error('[Newsletter] Global sweep error:', err.message);
  }
};

module.exports = { sendBlogNewsletter };
