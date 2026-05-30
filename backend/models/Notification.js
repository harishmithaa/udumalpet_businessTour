const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  title: {
    type: String,
    default: 'System Notification',
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['expiry_warning', 'expired', 'approval_status', 'broadcast', 'support'],
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readStatus: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

NotificationSchema.pre('save', async function() {
  if (this.isModified('isRead')) {
    this.readStatus = this.isRead;
  }
  if (this.isModified('readStatus')) {
    this.isRead = this.readStatus;
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
