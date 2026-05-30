const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
  },
  text: {
    type: String,
  },
  reviewText: {
    type: String,
  },
  status: {
    type: String,
    enum: ['approved', 'hidden', 'flagged', 'spam'],
    default: 'approved',
  },
  source: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
}, {
  timestamps: true
});

// Sync text and reviewText for full backward and frontend compatibility
ReviewSchema.pre('save', async function() {
  if (this.text && !this.reviewText) this.reviewText = this.text;
  if (this.reviewText && !this.text) this.text = this.reviewText;
});

module.exports = mongoose.model('Review', ReviewSchema);
