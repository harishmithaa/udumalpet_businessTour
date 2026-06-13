const mongoose = require('mongoose');

const UpdateSubscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UpdateSubscriber', UpdateSubscriberSchema);
