const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all approved testimonials (Public)
// @route   GET /api/testimonials
// @access  Public
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Submit a new testimonial (Public - Requires Login)
// @route   POST /api/testimonials
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { authorName, role, text, rating } = req.body;

    if (!authorName || !role || !text) {
      return res.status(400).json({ success: false, message: 'Please provide name, role, and thoughts.' });
    }

    const testimonial = await Testimonial.create({
      authorName,
      role,
      text,
      rating: Number(rating) || 5,
      authorId: req.user._id,
      authorEmail: req.user.email,
      status: 'Pending',
    });

    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all testimonials (Admin Moderation)
// @route   GET /api/testimonials/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update testimonial status (Admin Moderation)
// @route   PUT /api/testimonials/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    testimonial.status = status;
    await testimonial.save();

    if (status === 'Approved') {
      try {
        if (testimonial.authorEmail) {
          const { sendEmail } = require('../utils/emailHelper');
          await sendEmail({
            to: testimonial.authorEmail,
            subject: `Your Thoughts are Live on Udumalpet Business Tour!`,
            text: `Hello ${testimonial.authorName},\n\nWe are absolutely thrilled to inform you that your testimonial about UBT has been approved by our editorial team and is now live on our Home page!\n\nYour review:\n"${testimonial.text}"\n\nThank you for being an active member of the Udumalpet community!\n\nBest regards,\nUBT Team`,
            html: `
              <div style="font-family: sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); margin: 0 auto;">
                <h2 style="color: #027244; font-size: 20px; font-weight: 800; border-bottom: 2px solid #e6f7f0; padding-bottom: 10px; margin-top: 0;">UBT Editorial Desk</h2>
                <p style="font-size: 14px; line-height: 1.5;">Hello <strong>${testimonial.authorName}</strong>,</p>
                <p style="font-size: 14px; line-height: 1.5; color: #4a5568;">We are absolutely thrilled to inform you that your testimonial about UBT has been approved by our editorial team and is now live on our Home page!</p>
                
                <div style="background-color: #f7fafc; padding: 18px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 15px 0; color: #2d3748;">
                  <p style="margin: 0; font-size: 13.5px; line-height: 1.6; font-style: italic;">"${testimonial.text}"</p>
                </div>
                
                <p style="font-size: 13.5px; line-height: 1.5; color: #4a5568; margin-top: 25px;">Thank you for being a valued creator and sharing your real experience on our community portal!</p>
                
                <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 25px 0;" />
                <p style="font-size: 10.5px; color: #a0aec0; text-align: center; margin: 0;">
                  This is a system notification from Udumalpet Business Tour.
                </p>
              </div>
            `
          });
          console.log(`[SMTP] Testimonial approval email sent successfully to: ${testimonial.authorEmail}`);
        }
      } catch (emailErr) {
        console.error('[SMTP] Failed to send testimonial approval email:', emailErr.message);
      }
    }

    res.json({ success: true, message: `Testimonial successfully ${status.toLowerCase()}`, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete a testimonial (Private/Admin)
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    await testimonial.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
