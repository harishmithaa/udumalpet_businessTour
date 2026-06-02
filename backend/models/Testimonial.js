const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorEmail: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Business Owner', 'Event Manager', 'Blog Writer', 'Viewer', 'Other'],
    required: [true, 'Role is required'],
  },
  text: {
    type: String,
    required: [true, 'Testimonial thoughts are required'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5,
    default: 5,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
