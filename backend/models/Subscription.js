const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
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

// Pre-save syncing for plan/planType and endDate/expiryDate compatibility
SubscriptionSchema.pre('save', async function() {
  if (this.plan && !this.planType) this.planType = this.plan.toLowerCase();
  if (this.planType && !this.plan) {
    this.plan = this.planType.charAt(0).toUpperCase() + this.planType.slice(1);
  }
  if (this.endDate && !this.expiryDate) this.expiryDate = this.endDate;
  if (this.expiryDate && !this.endDate) this.endDate = this.expiryDate;
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
