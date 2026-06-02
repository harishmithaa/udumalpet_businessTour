const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  referredBusinessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending',
  },
  points: {
    type: Number,
    default: 100,
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  antiFraudChecks: {
    selfReferral: {
      type: Boolean,
      default: false,
    },
    duplicateMobile: {
      type: Boolean,
      default: false,
    },
    duplicateGST: {
      type: Boolean,
      default: false,
    },
    duplicateBusiness: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Referral', ReferralSchema);
