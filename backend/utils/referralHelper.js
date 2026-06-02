const Referral = require('../models/Referral');
const User = require('../models/User');
const Business = require('../models/Business');
const Notification = require('../models/Notification');

/**
 * Checks if all referral criteria are met for a business listing.
 * If yes, updates the referral status to completed and credits points to the referrer.
 * 
 * Criteria:
 * - Business is Approved
 * - Business subscriptionStatus is active
 * - Referral is currently in 'pending' status
 */
const checkAndCompleteReferralByBusiness = async (businessId) => {
  try {
    const business = await Business.findById(businessId);
    if (!business) {
      console.log(`[Referral Check] Business not found: ${businessId}`);
      return null;
    }

    // Find a pending referral for this business or owner
    const referral = await Referral.findOne({
      referredUserId: business.ownerId,
      status: 'pending'
    });

    if (!referral) {
      return null;
    }

    // Associate businessId to referral if not already linked
    if (!referral.referredBusinessId) {
      referral.referredBusinessId = business._id;
      await referral.save();
    }

    const isBusinessApproved = business.status === 'Approved' || business.verificationStatus === 'approved';
    const isSubscriptionActive = business.subscriptionStatus === 'active';

    if (isBusinessApproved && isSubscriptionActive) {
      // Complete referral
      referral.status = 'completed';
      await referral.save();

      // Credit points to the referrer
      const referrer = await User.findById(referral.referrerId);
      if (referrer) {
        referrer.referralPoints = (referrer.referralPoints || 0) + referral.points;
        await referrer.save();

        // Create platform notification for referrer
        await Notification.create({
          userId: referrer._id,
          title: 'Referral Points Awarded!',
          message: `Congratulations! Your referral for "${business.name}" is successful. You have earned ${referral.points} points (worth ₹${referral.points / 10} credit).`,
          type: 'referral_bonus'
        });

        console.log(`[Referral Success] Referrer ${referrer.email} awarded ${referral.points} points for business ${business.name}`);
      }

      return referral;
    }

    return null;
  } catch (error) {
    console.error(`[Referral Error] failed check:`, error);
    return null;
  }
};

module.exports = {
  checkAndCompleteReferralByBusiness
};
