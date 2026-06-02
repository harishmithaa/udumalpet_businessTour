const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Referral = require('../models/Referral');
const User = require('../models/User');
const Business = require('../models/Business');
const Notification = require('../models/Notification');
const { checkAndCompleteReferralByBusiness } = require('../utils/referralHelper');

// @desc    Get merchant referral statistics and code details
// @route   GET /api/referrals/my-stats
// @access  Private
router.get('/my-stats', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find all referrals made by this user
    const referrals = await Referral.find({ referrerId: user._id })
      .populate('referredUserId', 'fullName name email phone mobileNumber')
      .populate('referredBusinessId', 'name businessName status subscriptionStatus verificationStatus')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralPoints: user.referralPoints || 0,
        referralCredits: (user.referralPoints || 0) / 10, // 100 points = ₹10 credit
        referralLink: `http://localhost:5173/register?ref=${user.referralCode}`,
        referrals
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all referrals for administrative control
// @route   GET /api/referrals/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrerId', 'fullName name email phone mobileNumber')
      .populate('referredUserId', 'fullName name email phone mobileNumber')
      .populate('referredBusinessId', 'name businessName status subscriptionStatus verificationStatus gstNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Moderate a referral manually (manually approve or reject)
// @route   POST /api/referrals/admin/moderate
// @access  Private/Admin
router.post('/admin/moderate', protect, admin, async (req, res, next) => {
  try {
    const { referralId, action, rejectionReason } = req.body;

    if (!referralId || !action) {
      return res.status(400).json({ success: false, message: 'Referral ID and Action are required' });
    }

    const referral = await Referral.findById(referralId)
      .populate('referrerId')
      .populate('referredBusinessId');

    if (!referral) {
      return res.status(404).json({ success: false, message: 'Referral record not found' });
    }

    if (action === 'reject') {
      if (referral.status === 'completed') {
        // If it was completed, deduct points
        const referrer = referral.referrerId;
        if (referrer) {
          referrer.referralPoints = Math.max(0, (referrer.referralPoints || 0) - referral.points);
          await referrer.save();
        }
      }

      referral.status = 'rejected';
      referral.rejectionReason = rejectionReason || 'Rejected manually by administrator';
      await referral.save();

      // Notify referrer
      await Notification.create({
        userId: referral.referrerId._id,
        title: 'Referral Status Updated',
        message: `Your referral for "${referral.referredBusinessId?.name || 'a new member'}" was rejected. Reason: ${referral.rejectionReason}`,
        type: 'referral_update'
      });

      return res.json({ success: true, message: 'Referral successfully rejected', data: referral });
    }

    if (action === 'approve') {
      if (referral.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Referral is already completed' });
      }

      // Manually force-approve / complete referral
      referral.status = 'completed';
      await referral.save();

      // Credit points to the referrer
      const referrer = referral.referrerId;
      if (referrer) {
        referrer.referralPoints = (referrer.referralPoints || 0) + referral.points;
        await referrer.save();

        // Create platform notification for referrer
        await Notification.create({
          userId: referrer._id,
          title: 'Referral Manual Approval Successful!',
          message: `Your referral has been manually approved by admin. You have earned ${referral.points} points.`,
          type: 'referral_bonus'
        });
      }

      return res.json({ success: true, message: 'Referral manually approved and points credited', data: referral });
    }

    return res.status(400).json({ success: false, message: 'Invalid action. Must be "approve" or "reject".' });
  } catch (error) {
    next(error);
  }
});

// @desc    Get top referrers leaderboard list (dynamically calculated)
// @route   GET /api/referrals/top
// @access  Public
router.get('/top', async (req, res, next) => {
  try {
    const leaderboard = await Referral.aggregate([
      { $match: { status: 'completed' } },
      { 
        $group: { 
          _id: '$referrerId', 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]);

    // Populate referrer user details
    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (item) => {
        const user = await User.findById(item._id).select('fullName name businessName');
        return {
          name: user ? (user.businessName || user.fullName || user.name) : 'Anonymous Member',
          referralsCount: item.count
        };
      })
    );

    // Fallbacks in case there aren't enough dynamic referrers in the database yet
    const fallbacks = [
      { name: 'Lakshmi Textiles', referralsCount: 32 },
      { name: 'Sri Electricals', referralsCount: 27 },
      { name: 'ABC Traders', referralsCount: 21 }
    ];

    // Merge dynamic leaderboard with fallbacks to ensure exactly 3 beautiful positions are always displayed
    const finalLeaderboard = [...populatedLeaderboard];
    for (let i = finalLeaderboard.length; i < 3; i++) {
      // Find a fallback that isn't already in finalLeaderboard names
      const existingNames = new Set(finalLeaderboard.map(item => item.name));
      const nextFallback = fallbacks.find(fb => !existingNames.has(fb.name));
      if (nextFallback) {
        finalLeaderboard.push(nextFallback);
      }
    }

    res.json({
      success: true,
      data: finalLeaderboard.slice(0, 3)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
