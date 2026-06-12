const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  referralDiscount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending',
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  autoRenew: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

// Pre-save syncing for plan/planType and endDate/expiryDate and general compatibilities
SubscriptionSchema.pre('save', async function() {
  if (this.userId && !this.ownerId) this.ownerId = this.userId;
  if (this.ownerId && !this.userId) this.userId = this.ownerId;

  if (this.plan && !this.planName) this.planName = this.plan;
  if (this.planName && !this.plan) this.plan = this.planName;
  
  if (this.plan && !this.planType) this.planType = this.plan.toLowerCase();
  if (this.planType && !this.plan) {
    this.plan = this.planType.charAt(0).toUpperCase() + this.planType.slice(1);
  }
  
  if (this.amount !== undefined && this.amountPaid === undefined) this.amountPaid = this.amount;
  if (this.amountPaid !== undefined && this.amount === undefined) this.amount = this.amountPaid;
  
  if (this.endDate && !this.expiryDate) this.expiryDate = this.endDate;
  if (this.expiryDate && !this.endDate) this.endDate = this.expiryDate;
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);

