const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String, // card, upi, netbanking, etc.
    default: 'UPI',
  },
  status: {
    type: String,
    enum: ['Paid', 'Failed', 'Refunded', 'captured', 'failed'],
    default: 'Paid',
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Failed', 'Refunded'],
    default: 'Paid',
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// Pre-save syncing for compatibility between razorpay specific fields and requested general fields
PaymentSchema.pre('save', async function() {
  if (this.orderId && !this.razorpayOrderId) this.razorpayOrderId = this.orderId;
  if (this.razorpayOrderId && !this.orderId) this.orderId = this.razorpayOrderId;
  
  if (this.paymentId && !this.razorpayPaymentId) this.razorpayPaymentId = this.paymentId;
  if (this.razorpayPaymentId && !this.paymentId) this.paymentId = this.razorpayPaymentId;
  
  if (this.status) {
    if (this.status === 'captured') this.paymentStatus = 'Paid';
    else if (this.status === 'failed') this.paymentStatus = 'Failed';
    else this.paymentStatus = this.status;
  }
  if (this.paymentStatus && !this.status) {
    this.status = this.paymentStatus;
  }
  
  if (this.paymentDate && !this.paidAt) this.paidAt = this.paymentDate;
  if (this.paidAt && !this.paymentDate) this.paymentDate = this.paidAt;
});

module.exports = mongoose.model('Payment', PaymentSchema);

