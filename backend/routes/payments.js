const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { protect } = require('../middleware/auth');
const Business = require('../models/Business');
const Subscription = require('../models/Subscription');

// Initialize Razorpay client with fallback key
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mockSecret12345',
  });
} catch (error) {
  console.error('Error initializing Razorpay Client:', error.message);
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { businessId, planType, applyReferralPoints, redeemPointsAmount } = req.body;

    if (!businessId || !planType) {
      return res.status(400).json({ success: false, message: 'Business ID and Plan Type are required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    const Plan = require('../models/Plan');
    const dbPlan = await Plan.findOne({ type: planType, isActive: true });

    let amount = 0;
    if (dbPlan) {
      amount = dbPlan.price * 100; // Price in paise
    } else {
      // Fallback
      if (planType === 'Monthly') {
        amount = 69 * 100; // ₹69 in paise
      } else if (planType === 'Yearly') {
        amount = 690 * 100; // ₹690 in paise
      } else {
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
      }
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    let originalAmount = amount;
    let discountAmount = 0;
    let pointsUsed = 0;

    if (applyReferralPoints) {
      const points = user.referralPoints || 0;
      let pointsToUse = points;
      if (redeemPointsAmount !== undefined) {
        pointsToUse = Math.min(Number(redeemPointsAmount), points);
        if (pointsToUse < 0) pointsToUse = 0;
      }
      const maxDiscountPaise = pointsToUse * 10; // 1 point = 10 paise (₹0.10)

      if (maxDiscountPaise >= amount) {
        discountAmount = amount;
        pointsUsed = Math.ceil(amount / 10);
        amount = 0;
      } else {
        discountAmount = maxDiscountPaise;
        pointsUsed = pointsToUse;
        amount -= discountAmount;
      }
    }

    // If points cover 100% of the price
    if (amount === 0) {
      return res.json({
        success: true,
        orderId: 'free_referral_' + Date.now(),
        amount: 0,
        currency: 'INR',
        keyId: 'free',
        discountApplied: discountAmount / 100,
        pointsUsed
      });
    }

    // Razorpay mock / real order creation
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_biz_${businessId}_${Date.now()}`,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (err) {
      console.warn('Razorpay SDK failed (key invalid/unconfigured), creating a mock order object.');
      order = {
        id: 'order_mock_' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
      };
    }

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
      discountApplied: discountAmount / 100,
      pointsUsed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Razorpay Signature & Activate Subscription
// @route   POST /api/payments/verify-payment
// @access  Private
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      businessId,
      planType,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      applyReferralPoints,
      redeemPointsAmount,
    } = req.body;

    if (!businessId || !planType || !razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Missing payment parameters' });
    }

    // Verify Payment Signature
    let isSignatureValid = false;
    
    // Support bypassing signature check in sandbox mode
    if (razorpayOrderId.startsWith('order_mock_') || razorpayOrderId.startsWith('free_referral_') || !razorpaySignature) {
      console.log('Sandbox/Mock Payment Bypass verified.');
      isSignatureValid = true;
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mockSecret12345';
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Fetch Business
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Calculate dates
    const startDate = new Date();
    let endDate = new Date();

    const Plan = require('../models/Plan');
    const dbPlan = await Plan.findOne({ type: planType, isActive: true });

    const durationDays = dbPlan ? dbPlan.durationDays : (planType === 'Monthly' ? 28 : 365);
    endDate.setDate(startDate.getDate() + durationDays);

    const baseAmount = dbPlan ? dbPlan.price : (planType === 'Monthly' ? 69 : 690);
    let finalAmount = baseAmount;
    let pointsUsed = 0;

    if (applyReferralPoints) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id);
      const points = user.referralPoints || 0;
      let pointsToUse = points;
      if (redeemPointsAmount !== undefined) {
        pointsToUse = Math.min(Number(redeemPointsAmount), points);
        if (pointsToUse < 0) pointsToUse = 0;
      }
      const maxDiscount = pointsToUse / 10; // 10 points = 1 Rs

      if (maxDiscount >= baseAmount) {
        finalAmount = 0;
        pointsUsed = Math.ceil(baseAmount * 10);
      } else {
        finalAmount = baseAmount - maxDiscount;
        pointsUsed = pointsToUse;
      }

      if (pointsUsed > 0) {
        user.referralPoints -= pointsUsed;
        await user.save();
        console.log(`[Referral Redeem] Deducted ${pointsUsed} points from user ${user.email}`);
      }
    }

    // Create Subscription
    const subscription = await Subscription.create({
      businessId: business._id,
      ownerId: req.user._id,
      plan: planType,
      amount: finalAmount,
      status: 'active',
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9),
      startDate,
      endDate,
    });

    // Update Business status immediately
    business.subscriptionStatus = 'active';
    business.subscriptionExpiry = endDate;
    business.isPremium = true; // Premium features enabled upon payment
    
    // If the business was approved or pending, keep/approve
    if (['Pending Verification', 'Under Review'].includes(business.status)) {
      business.status = 'Approved';
    }
    
    await business.save();

    // Trigger referral point award check for the owner of the referral code
    const { checkAndCompleteReferralByBusiness } = require('../utils/referralHelper');
    await checkAndCompleteReferralByBusiness(business._id);

    res.json({
      success: true,
      message: 'Subscription successfully activated!',
      business,
      subscription,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

const Event = require('../models/Event');
const Payment = require('../models/Payment');

// @desc    Create Razorpay Order for an Event listing
// @route   POST /api/payments/create-event-order
// @access  Private
router.post('/create-event-order', protect, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: 'Event ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Double check subscription
    const activeBusiness = await Business.findOne({ 
      ownerId: req.user._id,
      subscriptionStatus: 'active' 
    });
    
    // Waived to 0 if business subscriber exists, standard listing fee is ₹99 otherwise
    const amount = activeBusiness ? 0 : 99 * 100; // in paise

    if (amount === 0) {
      return res.json({
        success: true,
        orderId: 'free_listing',
        amount: 0,
        currency: 'INR',
      });
    }

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_evt_${eventId}_${Date.now()}`,
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (err) {
      console.warn('Razorpay SDK failed, fallback to mock order.');
      order = {
        id: 'order_mock_' + Math.random().toString(36).substr(2, 9),
        amount: amount,
        currency: 'INR',
        receipt: options.receipt,
        status: 'created',
      };
    }

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Verify Razorpay Signature & Mark Event listing as Paid
// @route   POST /api/payments/verify-event-payment
// @access  Private
router.post('/verify-event-payment', protect, async (req, res) => {
  try {
    const {
      eventId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (!eventId || !razorpayOrderId) {
      return res.status(400).json({ success: false, message: 'Missing payment parameters' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Verify signature
    let isSignatureValid = false;
    if (razorpayOrderId.startsWith('order_mock_') || razorpayOrderId === 'free_listing' || !razorpaySignature) {
      console.log('Event Sandbox/Mock Payment Bypass verified.');
      isSignatureValid = true;
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mockSecret12345';
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpaySignature;
    }

    if (!isSignatureValid) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update event paymentStatus
    const activeBusiness = await Business.findOne({ 
      ownerId: req.user._id,
      subscriptionStatus: 'active' 
    });
    event.paymentStatus = activeBusiness ? 'Free' : 'Paid';
    event.price = activeBusiness ? 0 : 99;
    await event.save();

    // Create Payment record if not free
    if (!activeBusiness) {
      await Payment.create({
        eventId: event._id,
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9),
        amount: 99,
        paymentStatus: 'Paid',
      });
    }

    res.json({
      success: true,
      message: 'Event payment successfully verified!',
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
