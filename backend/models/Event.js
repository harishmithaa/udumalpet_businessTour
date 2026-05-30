const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
  },
  eventDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
  },
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
  },
  location: {
    type: String,
  },
  organizer: {
    type: String,
    required: [true, 'Event organizer is required'],
  },
  phone: {
    type: String,
    required: [true, 'Event contact number is required'],
  },
  price: {
    type: Number,
    default: 99,
  },
  coverImageUrl: {
    type: String,
    default: '',
  },
  bannerImage: {
    type: String,
  },
  paymentLink: {
    type: String,
    default: '',
  },
  duration: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Pending Review', 'Approved', 'Rejected', 'pending', 'approved', 'rejected'],
    default: 'Pending Review',
  }
}, {
  timestamps: true
});

// Auto-sync backward compatibility fields
EventSchema.pre('save', async function() {
  if (this.ownerId && !this.authorId) this.authorId = this.ownerId;
  if (this.authorId && !this.ownerId) this.ownerId = this.authorId;
  
  if (this.coverImageUrl && !this.bannerImage) this.bannerImage = this.coverImageUrl;
  if (this.bannerImage && !this.coverImageUrl) this.coverImageUrl = this.bannerImage;
  
  if (this.date && !this.eventDate) this.eventDate = this.date;
  if (this.eventDate && !this.date) this.date = this.eventDate;
  
  if (this.venue && !this.location) this.location = this.venue;
  if (this.location && !this.venue) this.venue = this.location;
});

module.exports = mongoose.model('Event', EventSchema);
