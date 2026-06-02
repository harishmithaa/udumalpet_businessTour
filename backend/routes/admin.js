const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Business = require('../models/Business');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const User = require('../models/User');

const {
  moderateBusiness,
  moderateBlog,
  moderateEvent,
  moderateReview,
  moderateUser
} = require('../controllers/adminController');

// Protect all admin routes
router.use(protect);
router.use(admin);

// @desc    Get dashboard statistics for Admin
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalCount = await Business.countDocuments();
    const pendingCount = await Business.countDocuments({ status: 'Pending Verification' });
    const underReviewCount = await Business.countDocuments({ status: 'Under Review' });
    const approvedCount = await Business.countDocuments({ status: 'Approved' });
    const rejectedCount = await Business.countDocuments({ status: 'Rejected' });
    const suspendedCount = await Business.countDocuments({ status: 'Suspended' });

    // Subscriptions
    const activeSubs = await Business.countDocuments({ subscriptionStatus: 'active' });
    const expiredSubs = await Business.countDocuments({ subscriptionStatus: 'expired' });

    // Users counts
    const totalUsers = await User.countDocuments();
    const merchantsCount = await User.countDocuments({ role: 'merchant' });

    res.json({
      success: true,
      stats: {
        totalBusinesses: totalCount,
        pendingApprovals: pendingCount + underReviewCount,
        pendingVerification: pendingCount,
        underReview: underReviewCount,
        approvedBusinesses: approvedCount,
        rejectedBusinesses: rejectedCount,
        suspendedBusinesses: suspendedCount,
        deactivatedBusinesses: suspendedCount,
        activeSubscriptions: activeSubs,
        expiredSubscriptions: expiredSubs,
        totalUsers,
        totalMerchants: merchantsCount
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all businesses for admin audit
// @route   GET /api/admin/businesses
// @access  Private/Admin
router.get('/businesses', async (req, res, next) => {
  try {
    const businesses = await Business.find().sort({ createdAt: -1 });
    res.json({ success: true, count: businesses.length, data: businesses });
  } catch (error) {
    next(error);
  }
});

// @desc    Moderate business listing (approve, reject, suspend)
// @route   POST /api/admin/businesses/moderate
// @access  Private/Admin
router.post('/businesses/moderate', moderateBusiness);

// @desc    Approve/Reject/Deactivate a business profile (backward compatibility)
// @route   PUT /api/admin/businesses/:id/status
// @access  Private/Admin
router.put('/businesses/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const business = await Business.findById(req.params.id).populate('ownerId');
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    business.status = status;
    if (status === 'Approved') {
      business.isAddressVerified = true;
      business.verificationStatus = 'approved';
    } else if (status === 'Rejected') {
      business.verificationStatus = 'rejected';
    } else if (status === 'Suspended') {
      business.verificationStatus = 'suspended';
      business.subscriptionStatus = 'none';
      business.isPremium = false;
    }
    
    await business.save({ validateBeforeSave: false });

    if (status === 'Approved') {
      const { checkAndCompleteReferralByBusiness } = require('../utils/referralHelper');
      await checkAndCompleteReferralByBusiness(business._id);
    }

    await Notification.create({
      userId: business.ownerId ? (business.ownerId._id || business.ownerId) : null,
      businessId: business._id,
      title: 'Listing Moderation Update',
      message: `Your business "${business.name}" has been ${status.toLowerCase()} by the administrator.`,
      type: 'approval_status',
    });

    if (business.ownerId && business.ownerId.email) {
      const ownerName = business.ownerId.fullName || business.ownerId.name || 'Merchant';
      const { sendEmail } = require('../utils/emailHelper');
      try {
        await sendEmail({
          to: business.ownerId.email,
          subject: `Listing Moderation Update: "${business.name}"`,
          text: `Hello ${ownerName},\n\nYour business directory listing "${business.name}" has been updated by the administrator.\n\nStatus: ${status}\n\nPlease log in to your dashboard for details.\n\nBest regards,\nUBT Moderation Team`
        });
      } catch (err) {
        console.error('[SMTP] Failed to send business status email:', err.message);
      }
    }

    res.json({ success: true, message: `Business successfully ${status}`, data: business });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle premium visibility override
// @route   PUT /api/admin/businesses/:id/premium
// @access  Private/Admin
router.put('/businesses/:id/premium', async (req, res, next) => {
  try {
    const { isPremium } = req.body;
    if (typeof isPremium !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isPremium must be a boolean' });
    }

    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    business.isPremium = isPremium;
    if (isPremium) {
      business.subscriptionStatus = 'active';
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 365);
      business.subscriptionExpiry = expiry;
    } else {
      business.subscriptionStatus = 'none';
      business.subscriptionExpiry = null;
    }

    await business.save();
    res.json({ success: true, message: `Premium visibility toggled to ${isPremium}`, data: business });
  } catch (error) {
    next(error);
  }
});

// @desc    Moderate blogs (approve, reject)
// @route   PUT /api/admin/blogs/moderate
// @access  Private/Admin
router.put('/blogs/moderate', moderateBlog);

// @desc    Moderate events (approve, reject)
// @route   PUT /api/admin/events/moderate
// @access  Private/Admin
router.put('/events/moderate', moderateEvent);

// @desc    Moderate reviews (approve, hide, spam, delete)
// @route   PUT /api/admin/reviews/moderate
// @access  Private/Admin
router.put('/reviews/moderate', moderateReview);

// @desc    Moderate users (suspend, block/unblock)
// @route   PUT /api/admin/users/moderate
// @access  Private/Admin
router.put('/users/moderate', moderateUser);

// @desc    Send custom platform notification
// @route   POST /api/admin/notifications/send
// @access  Private/Admin
router.post('/notifications/send', async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;
    if (!userId || !message) {
      return res.status(400).json({ success: false, message: 'userId and message parameters are required' });
    }

    const notification = await Notification.create({
      userId,
      title: title || 'System Update',
      message,
      type: type || 'broadcast'
    });

    res.status(201).json({ success: true, message: 'Notification dispatched successfully', data: notification });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
