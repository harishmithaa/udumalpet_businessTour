const Business = require('../models/Business');
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const Review = require('../models/Review');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AdminAction = require('../models/AdminAction');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { sendEmail } = require('../utils/emailHelper');

/**
 * Moderate business listings (approve, reject, suspend)
 */
const moderateBusiness = async (req, res, next) => {
  try {
    const { businessId, action, remarks } = req.body;

    const business = await Business.findById(businessId).populate('ownerId');
    if (!business) {
      return sendError(res, 404, 'Business listing not found');
    }

    let nextStatus = 'Pending Verification';
    let nextVerification = 'pending';

    if (action === 'approve') {
      nextStatus = 'Approved';
      nextVerification = 'approved';
    } else if (action === 'reject') {
      nextStatus = 'Rejected';
      nextVerification = 'rejected';
    } else if (action === 'suspend') {
      nextStatus = 'Suspended';
      nextVerification = 'suspended';
    } else if (action === 'reactivate') {
      nextStatus = 'Approved';
      nextVerification = 'approved';
    }

    business.status = nextStatus;
    business.verificationStatus = nextVerification;
    if (action === 'suspend') {
      business.subscriptionStatus = 'none';
      business.isPremium = false;
    }
    await business.save({ validateBeforeSave: false });

    if (action === 'approve' || action === 'reactivate') {
      const { checkAndCompleteReferralByBusiness } = require('../utils/referralHelper');
      await checkAndCompleteReferralByBusiness(business._id);
    }

    // Log the administrative action audit trail
    await AdminAction.create({
      adminId: req.user._id,
      targetBusinessId: business._id,
      actionType: action,
      remarks: remarks || `Administrative status change to ${nextStatus}`
    });

    // Notify owner via Email
    if (business.ownerId && business.ownerId.email) {
      const ownerName = business.ownerId.fullName || business.ownerId.name || 'Merchant';
      try {
        await sendEmail({
          to: business.ownerId.email,
          subject: `Listing Moderation Update: "${business.name}"`,
          text: `Hello ${ownerName},\n\nYour business directory listing "${business.name}" has been ${action}d by the moderation team.\n\nRemarks:\n"${remarks || 'None'}"\n\nBest regards,\nUBT Moderation Team`
        });
      } catch (err) {
        console.error('[SMTP] Failed to send business status email:', err.message);
      }
    }

    return sendSuccess(res, 200, `Business successfully ${action}d`, business);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate Blog articles (approve, reject)
 */
const moderateBlog = async (req, res, next) => {
  try {
    const { blogId, status, suggestions } = req.body;

    const blog = await Blog.findById(blogId).populate('author');
    if (!blog) {
      return sendError(res, 404, 'Blog post not found');
    }

    blog.status = status; // 'Approved', 'Rejected', 'Pending Approval', 'Needs Revision'
    if (status === 'Needs Revision') {
      blog.revisionSuggestions = suggestions || '';
      blog.revisionHistory.push({
        sender: req.user._id,
        senderName: req.user.fullName || req.user.name || 'Admin',
        senderRole: req.user.role || 'admin',
        message: suggestions || ''
      });
    }
    await blog.save({ validateBeforeSave: false });

    // Trigger newsletter broadcast if approved
    if (status === 'Approved') {
      try {
        const { sendBlogNewsletter } = require('../utils/newsletterHelper');
        sendBlogNewsletter(blog);
      } catch (err) {
        console.error('Failed to initiate newsletter helper:', err.message);
      }
    }

    // Notify author in-app
    await Notification.create({
      userId: blog.author ? (blog.author._id || blog.author) : null,
      title: `Blog Moderation Update`,
      message: status === 'Needs Revision'
        ? `Your blog post "${blog.title}" requires revisions: "${suggestions}"`
        : `Your blog post "${blog.title}" has been reviewed and ${status.toLowerCase()} by moderation team.`,
      type: 'approval_status'
    });

    // Notify author via Email
    if (blog.author && blog.author.email) {
      const authorName = blog.author.fullName || blog.author.name || 'Writer';
      let emailSubject = `Blog Moderation Update: "${blog.title}"`;
      let emailText = `Hello ${authorName},\n\nYour blog post "${blog.title}" has been reviewed by the UBT moderation team.\n\nStatus: ${status}\n\n`;

      if (status === 'Needs Revision') {
        emailSubject = `Action Required: Revisions requested for your blog post "${blog.title}"`;
        emailText = `Hello ${authorName},\n\nThe administrator has reviewed your blog post "${blog.title}" and requested some revisions.\n\nSuggestions/Comments:\n"${suggestions}"\n\nPlease log in to the portal, update your blog post, and re-submit it for review.`;
      } else if (status === 'Approved') {
        emailText += `Congratulations! Your article is now live and published on the platform.`;
      } else if (status === 'Rejected') {
        emailText += `Unfortunately, your article was rejected and will not be published.`;
      }

      emailText += `\n\nThank you,\nUBT Moderation Team`;

      try {
        await sendEmail({
          to: blog.author.email,
          subject: emailSubject,
          text: emailText
        });
      } catch (err) {
        console.error('[SMTP] Failed to send blog status email:', err.message);
      }
    }

    return sendSuccess(res, 200, `Blog article successfully updated to ${status}`, blog);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate Event listings (approve, reject)
 */
const moderateEvent = async (req, res, next) => {
  try {
    const { eventId, status } = req.body;

    const event = await Event.findById(eventId).populate('ownerId');
    if (!event) {
      return sendError(res, 404, 'Event listing not found');
    }

    event.status = status; // 'Approved', 'Rejected', 'Pending Review'
    await event.save({ validateBeforeSave: false });

    // Notify organizer
    if (event.ownerId) {
      await Notification.create({
        userId: event.ownerId._id || event.ownerId,
        title: `Event Moderation Update`,
        message: `Your event flyer "${event.title}" has been reviewed and ${status.toLowerCase()} by moderation team.`,
        type: 'approval_status'
      });

      if (event.ownerId.email) {
        const organizerName = event.ownerId.fullName || event.ownerId.name || 'Organizer';
        try {
          await sendEmail({
            to: event.ownerId.email,
            subject: `Event Moderation Update: "${event.title}"`,
            text: `Hello ${organizerName},\n\nYour event listing "${event.title}" has been reviewed by the moderation team.\n\nStatus: ${status}\n\nPlease log in to your dashboard to view comments or details.\n\nBest regards,\nUBT Moderation Team`
          });
        } catch (err) {
          console.error('[SMTP] Failed to send event moderation email:', err.message);
        }
      }
    }

    return sendSuccess(res, 200, `Event flyer successfully ${status.toLowerCase()}`, event);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate user reviews (approve, hide, spam flags)
 */
const moderateReview = async (req, res, next) => {
  try {
    const { reviewId, action } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (action === 'delete') {
      await Review.deleteOne({ _id: reviewId });
      return sendSuccess(res, 200, 'Review permanently deleted');
    }

    review.status = action; // 'approved', 'hidden', 'flagged', 'spam'
    await review.save();

    return sendSuccess(res, 200, `Review status updated to ${action}`, review);
  } catch (err) {
    next(err);
  }
};

/**
 * Moderate users directories (suspend, block/unblock)
 */
const moderateUser = async (req, res, next) => {
  try {
    const { userId, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, 404, 'User account not found');
    }

    user.status = status; // 'Active', 'Suspended'
    await user.save();

    // Sync status: if user suspended, suspend all their business directories
    if (status === 'Suspended') {
      await Business.updateMany(
        { ownerId: user._id },
        { status: 'Suspended', verificationStatus: 'suspended', isPremium: false, subscriptionStatus: 'none' }
      );
    }

    return sendSuccess(res, 200, `User account successfully marked as ${status}`, user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  moderateBusiness,
  moderateBlog,
  moderateEvent,
  moderateReview,
  moderateUser
};
