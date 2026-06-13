const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parentBusinessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null,
  },
  branchManagerName: {
    type: String,
    trim: true,
  },
  googleMapsLocation: {
    type: String,
    trim: true,
  },
  googleBusinessLink: {
    type: String,
    trim: true,
  },
  workingHours: {
    type: String,
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  name: {
    type: String,
    trim: true,
  },
  businessName: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  yearEstablished: {
    type: Number,
  },
  employeeCount: {
    type: String,
  },
  gstNumber: {
    type: String,
    trim: true,
  },
  services: {
    type: [String],
    default: [],
  },
  brands: {
    type: [String],
    default: [],
  },
  highlights: {
    type: [String],
    default: [],
  },
  phone: {
    type: String,
    trim: true,
  },
  whatsapp: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  facebook: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  locality: {
    type: String,
  },
  city: {
    type: String,
    required: true,
    default: 'Udumalpet',
  },
  state: {
    type: String,
    required: true,
    default: 'Tamil Nadu',
  },
  pincode: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  isAddressVerified: {
    type: Boolean,
    default: false,
  },
  logoUrl: {
    type: String,
    default: '',
  },
  coverImageUrl: {
    type: String,
    default: '',
  },
  coverImageOffset: {
    type: Number,
    default: 50,
  },
  galleryUrls: {
    type: [String],
    default: [],
  },
  galleryImages: {
    type: [String],
    default: [],
  },
  menuUrls: {
    type: [String],
    default: [],
  },
  isFoodBusiness: {
    type: Boolean,
    default: false,
  },
  googlePlaceId: {
    type: String,
    default: '',
  },
  googleLinked: {
    type: Boolean,
    default: false,
  },
  googleRating: {
    type: Number,
    default: 0,
  },
  googleReviewsCount: {
    type: Number,
    default: 0,
  },
  googleReviews: [
    {
      authorName: String,
      rating: Number,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  coordinates: {
    lat: { type: Number, default: 10.585 },
    lng: { type: Number, default: 77.251 },
  },
  timings: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      Monday: '9:00 AM - 8:00 PM',
      Tuesday: '9:00 AM - 8:00 PM',
      Wednesday: '9:00 AM - 8:00 PM',
      Thursday: '9:00 AM - 8:00 PM',
      Friday: '9:00 AM - 8:00 PM',
      Saturday: '9:00 AM - 8:00 PM',
      Sunday: '9:00 AM - 1:00 PM',
    },
  },
  openingHours: {
    type: mongoose.Schema.Types.Mixed,
  },
  status: {
    type: String,
    enum: ['Pending Verification', 'Under Review', 'Approved', 'Rejected', 'Suspended'],
    default: 'Pending Verification',
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
    default: 'pending',
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'none', 'suspended'],
    default: 'none',
  },
  subscriptionExpiry: {
    type: Date,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  customCategoryName: {
    type: String,
    trim: true,
  },
  requestedParentCategory: {
    type: String,
    trim: true,
  },
  categoryStatus: {
    type: String,
    enum: ['Normal', 'Pending Review'],
    default: 'Normal',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  callClicks: {
    type: Number,
    default: 0,
  },
  whatsappClicks: {
    type: Number,
    default: 0,
  },
  websiteClicks: {
    type: Number,
    default: 0,
  },
  instagramClicks: {
    type: Number,
    default: 0,
  },
  facebookClicks: {
    type: Number,
    default: 0,
  },
  offers: [
    {
      id: { type: String },
      title: { type: String },
      description: { type: String },
      rate: { type: String },
      expiry: { type: String },
      active: { type: Boolean, default: true },
      banner: { type: String }
    }
  ]
}, {
  timestamps: true
});

// Auto-sync names, slugs, and gallery image urls
BusinessSchema.pre('save', async function() {
  if (this.name && !this.businessName) this.businessName = this.name;
  if (this.businessName && !this.name) this.name = this.businessName;
  if (this.galleryUrls && this.galleryUrls.length && (!this.galleryImages || !this.galleryImages.length)) this.galleryImages = this.galleryUrls;
  if (this.galleryImages && this.galleryImages.length && (!this.galleryUrls || !this.galleryUrls.length)) this.galleryUrls = this.galleryImages;
  
  if (this.status) {
    const statusMap = {
      'Pending Verification': 'pending',
      'Under Review': 'under_review',
      'Approved': 'approved',
      'Rejected': 'rejected',
      'Suspended': 'suspended'
    };
    this.verificationStatus = statusMap[this.status] || 'pending';
  }

  if (this.businessName && this.isModified('businessName')) {
    this.slug = this.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

module.exports = mongoose.model('Business', BusinessSchema);
