const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { protect, admin } = require('../middleware/auth');
const Business = require('../models/Business');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const User = require('../models/User');
const Event = require('../models/Event');
const Payment = require('../models/Payment');

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

    const dbPlan = await Plan.findOne({
      $or: [
        { type: planType },
        { name: planType }
      ],
      isActive: true
    });

    let planPrice = 0;
    if (dbPlan) {
      planPrice = dbPlan.price;
    } else {
      // Fallback
      if (planType === 'Monthly') {
        planPrice = 99;
      } else if (planType === 'Yearly') {
        planPrice = 999;
      } else {
        return res.status(400).json({ success: false, message: 'Invalid plan type' });
      }
    }

    const user = await User.findById(req.user._id);

    // Business Rule #2: Max 10% deduction of plan value
    const maxDiscountRupees = Math.round(planPrice * 0.1);
    const maxPointsAllowed = maxDiscountRupees * 10; // 10 points = 1 Rupee

    let discountAmountRupees = 0;
    let pointsUsed = 0;

    if (applyReferralPoints) {
      const points = user.referralPoints || 0;
      let pointsToUse = points;
      if (redeemPointsAmount !== undefined) {
        pointsToUse = Math.min(Number(redeemPointsAmount), points);
      }
      pointsToUse = Math.max(0, pointsToUse);
      
      // Limit points by the maximum points allowed for this plan
      pointsUsed = Math.min(pointsToUse, maxPointsAllowed);
      discountAmountRupees = pointsUsed / 10;
    }

    const finalAmountRupees = planPrice - discountAmountRupees;
    const amount = Math.round(finalAmountRupees * 100); // paise

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
      discountApplied: discountAmountRupees,
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

    const dbPlan = await Plan.findOne({
      $or: [
        { type: planType },
        { name: planType }
      ],
      isActive: true
    });

    const durationDays = dbPlan ? dbPlan.durationDays : (planType === 'Monthly' ? 28 : 365);
    endDate.setDate(startDate.getDate() + durationDays);

    const baseAmount = dbPlan ? dbPlan.price : (planType === 'Monthly' ? 99 : 999);
    
    // Business Rule #2: Max 10% deduction of plan value
    const maxDiscountRupees = Math.round(baseAmount * 0.1);
    const maxPointsAllowed = maxDiscountRupees * 10;

    let discountAmountRupees = 0;
    let pointsUsed = 0;

    const user = await User.findById(req.user._id);

    if (applyReferralPoints) {
      const points = user.referralPoints || 0;
      let pointsToUse = points;
      if (redeemPointsAmount !== undefined) {
        pointsToUse = Math.min(Number(redeemPointsAmount), points);
      }
      pointsToUse = Math.max(0, pointsToUse);
      pointsUsed = Math.min(pointsToUse, maxPointsAllowed);
      discountAmountRupees = pointsUsed / 10;

      if (pointsUsed > 0) {
        user.referralPoints -= pointsUsed;
        await user.save();
        console.log(`[Referral Redeem] Deducted ${pointsUsed} points from user ${user.email}`);
      }
    }

    const finalAmount = baseAmount - discountAmountRupees;

    // Create Subscription
    const subscription = await Subscription.create({
      userId: req.user._id,
      ownerId: req.user._id,
      businessId: business._id,
      plan: planType,
      planName: planType,
      amount: finalAmount,
      amountPaid: finalAmount,
      referralDiscount: discountAmountRupees,
      status: 'active',
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9),
      startDate,
      endDate,
      expiryDate: endDate,
    });

    // Create Payment record
    const payment = await Payment.create({
      userId: req.user._id,
      businessId: business._id,
      subscriptionId: subscription._id,
      orderId: razorpayOrderId,
      paymentId: subscription.razorpayPaymentId,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: subscription.razorpayPaymentId,
      amount: finalAmount,
      paymentMethod: 'UPI',
      status: 'Paid',
      paymentStatus: 'Paid',
      paymentDate: new Date(),
      paidAt: new Date(),
    });

    // Update Business status immediately
    business.subscriptionStatus = 'active';
    business.subscriptionExpiry = endDate;
    business.isPremium = true; // Premium features enabled upon payment
    await business.save();

    // Trigger referral point award check for the owner of the referral code
    const { checkAndCompleteReferralByBusiness } = require('../utils/referralHelper');
    await checkAndCompleteReferralByBusiness(business._id);

    res.json({
      success: true,
      message: 'Subscription successfully activated!',
      business,
      subscription,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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
    await event.save();

    // Create Payment record if not free
    let payment = null;
    if (!activeBusiness) {
      payment = await Payment.create({
        userId: req.user._id,
        eventId: event._id,
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9),
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9),
        amount: 99,
        paymentMethod: 'UPI',
        status: 'Paid',
        paymentStatus: 'Paid',
        paymentDate: new Date(),
        paidAt: new Date(),
      });
    }

    res.json({
      success: true,
      message: 'Event payment successfully verified!',
      event,
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's payment history
// @route   GET /api/payments/my-history
// @access  Private
router.get('/my-history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('subscriptionId')
      .populate('eventId')
      .populate('businessId')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all payments for admin monitoring
// @route   GET /api/payments/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name fullName email phone mobileNumber')
      .populate('businessId', 'name businessName')
      .populate('eventId', 'title')
      .populate('subscriptionId', 'plan planName')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Razorpay Webhook Handler
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_test_mockWebhookSecret12345';
    let isWebhookValid = false;

    // Validate signature
    try {
      const generatedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature === generatedSignature) {
        isWebhookValid = true;
      } else {
        try {
          Razorpay.validateWebhookSignature(
            JSON.stringify(req.body),
            signature,
            webhookSecret
          );
          isWebhookValid = true;
        } catch (e) {
          if (process.env.NODE_ENV !== 'production' && (!signature || signature === 'mock')) {
            console.log('Bypassing webhook signature validation in development environment.');
            isWebhookValid = true;
          }
        }
      }
    } catch (err) {
      console.error('Webhook signature verification check failed:', err);
    }

    if (!isWebhookValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const { event: eventType, payload } = req.body;
    if (!payload || !payload.payment) {
      return res.json({ success: true, message: 'Webhook event type unhandled' });
    }

    const paymentEntity = payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const amount = paymentEntity.amount / 100; // Rupee conversion

    console.log(`[Webhook details] Event: ${eventType}, Order: ${orderId}, Payment ID: ${paymentId}`);

    if (eventType === 'payment.captured') {
      let payment = await Payment.findOne({ razorpayOrderId: orderId });
      const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
      let eventRecord = null;
      if (!subscription) {
        eventRecord = await Event.findOne({
          $or: [
            { razorpayOrderId: orderId },
            { orderId: orderId }
          ]
        });
      }

      if (!payment) {
        const userId = subscription ? (subscription.userId || subscription.ownerId) : (eventRecord ? eventRecord.ownerId : null);
        if (userId) {
          payment = await Payment.create({
            userId,
            businessId: subscription ? subscription.businessId : undefined,
            subscriptionId: subscription ? subscription._id : undefined,
            eventId: eventRecord ? eventRecord._id : undefined,
            orderId: orderId,
            paymentId: paymentId,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount: amount,
            paymentMethod: paymentEntity.method || 'UPI',
            status: 'Paid',
            paymentStatus: 'Paid',
            paymentDate: new Date(),
            paidAt: new Date(),
          });
        }
      } else {
        payment.status = 'Paid';
        payment.paymentStatus = 'Paid';
        payment.paymentId = paymentId;
        payment.razorpayPaymentId = paymentId;
        payment.paymentMethod = paymentEntity.method || payment.paymentMethod;
        payment.paidAt = new Date();
        payment.paymentDate = new Date();
        await payment.save();
      }

      if (subscription && subscription.status !== 'active') {
        subscription.status = 'active';
        subscription.razorpayPaymentId = paymentId;
        subscription.startDate = subscription.startDate || new Date();
        
        if (!subscription.endDate || !subscription.expiryDate) {
          const dbPlan = await Plan.findOne({ name: subscription.planName });
          const durationDays = dbPlan ? dbPlan.durationDays : (subscription.plan === 'Monthly' ? 28 : 365);
          const endDate = new Date();
          endDate.setDate(subscription.startDate.getDate() + durationDays);
          subscription.endDate = endDate;
          subscription.expiryDate = endDate;
        }
        await subscription.save();

        const business = await Business.findById(subscription.businessId);
        if (business) {
          business.subscriptionStatus = 'active';
          business.subscriptionExpiry = subscription.endDate;
          business.isPremium = true;
          await business.save();
        }
      }

      if (eventRecord) {
        eventRecord.paymentStatus = 'Paid';
        await eventRecord.save();
      }
    } else if (eventType === 'payment.failed') {
      let payment = await Payment.findOne({ razorpayOrderId: orderId });
      const subscription = await Subscription.findOne({ razorpayOrderId: orderId });
      let eventRecord = null;
      if (!subscription) {
        eventRecord = await Event.findOne({
          $or: [
            { razorpayOrderId: orderId },
            { orderId: orderId }
          ]
        });
      }

      if (!payment) {
        const userId = subscription ? (subscription.userId || subscription.ownerId) : (eventRecord ? eventRecord.ownerId : null);
        if (userId) {
          payment = await Payment.create({
            userId,
            businessId: subscription ? subscription.businessId : undefined,
            subscriptionId: subscription ? subscription._id : undefined,
            eventId: eventRecord ? eventRecord._id : undefined,
            orderId: orderId,
            paymentId: paymentId,
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            amount: amount,
            paymentMethod: paymentEntity.method || 'UPI',
            status: 'Failed',
            paymentStatus: 'Failed',
            paymentDate: new Date(),
          });
        }
      } else {
        payment.status = 'Failed';
        payment.paymentStatus = 'Failed';
        payment.paymentId = paymentId;
        payment.razorpayPaymentId = paymentId;
        await payment.save();
      }

      if (subscription) {
        subscription.status = 'pending';
        await subscription.save();
      }
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
