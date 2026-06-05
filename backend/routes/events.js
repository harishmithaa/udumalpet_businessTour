const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Seed default events if collection is empty
const seedDefaultEvents = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      await Event.create([
        {
          title: 'Udumalpet Marathon 2025',
          category: 'Sports',
          description: 'Join us for a fitness-filled marathon event across beautiful routes in Udumalpet.',
          date: new Date('2025-05-25T06:00:00'),
          endDate: new Date('2025-05-25T18:00:00'),
          time: 'Sunday, 6:00 AM',
          venue: 'Udumalpet Town, Tamil Nadu',
          organizer: 'FitLife Club Udumalpet',
          phone: '+91 98945 67890',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=500&q=80',
          status: 'Approved',
          isCompleted: true,
          paymentStatus: 'Paid'
        },
        {
          title: 'Arulmigu Subramanya Swamy Temple Festival',
          category: 'Festival',
          description: 'Annual temple festival with special poojas, processions and cultural programs.',
          date: new Date('2025-06-10T00:00:00'),
          endDate: new Date('2025-06-16T23:59:59'),
          time: 'All Day',
          venue: 'Palani Road, Udumalpet',
          organizer: 'Temple Committee',
          phone: '+91 97500 12345',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1608958416755-22d7d566f1ea?w=500&q=80',
          status: 'Approved',
          isCompleted: true,
          paymentStatus: 'Paid'
        },
        {
          title: 'Udumalpet Startup Meet 2025',
          category: 'Business',
          description: 'A meetup for entrepreneurs, innovators and business enthusiasts.',
          date: new Date('2025-06-28T10:00:00'),
          endDate: new Date('2025-06-28T17:00:00'),
          time: 'Saturday, 10:00 AM',
          venue: 'Udumalpet IT Park',
          organizer: 'Udumalpet Startup Hub',
          phone: '+91 90035 67890',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&q=80',
          status: 'Approved',
          isCompleted: true,
          paymentStatus: 'Paid'
        },
        {
          title: 'Carnatic Music Concert',
          category: 'Music',
          description: 'An evening of classical Carnatic music by renowned artists.',
          date: new Date('2025-07-05T18:30:00'),
          endDate: new Date('2025-07-05T21:30:00'),
          time: 'Saturday, 6:30 PM',
          venue: 'Sri Krishna Mahal, Udumalpet',
          organizer: 'Sangeetha Sabha',
          phone: '+91 98422 33445',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80',
          status: 'Approved',
          isCompleted: true,
          paymentStatus: 'Paid'
        }
      ]);
      console.log('Default UBT Events seeded successfully');
    }
  } catch (err) {
    console.error('Error seeding default events:', err.message);
  }
};

// Execute seed
seedDefaultEvents();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, dateType } = req.query;
    let query = { status: 'Approved', isCompleted: true };

    // Category Filter
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Search Query (title, description, venue, organizer)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }

    // Dynamic upcoming vs past selector
    // If not specified, returns all sorted by date
    let events = await Event.find(query).populate('businessId').sort({ date: 1 });

    // Client side or query date filter:
    const today = new Date();
    if (dateType === 'upcoming') {
      events = events.filter(e => new Date(e.date) >= today || (e.endDate && new Date(e.endDate) >= today));
    } else if (dateType === 'past') {
      events = events.filter(e => new Date(e.date) < today && (!e.endDate || new Date(e.endDate) < today));
    }

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const { protect, admin } = require('../middleware/auth');
const Business = require('../models/Business');
const User = require('../models/User');

// @desc    Check active business subscription for current user
// @route   GET /api/events/check-subscription
// @access  Private
router.get('/check-subscription', protect, async (req, res) => {
  try {
    const business = await Business.findOne({ 
      ownerId: req.user._id,
      subscriptionStatus: 'active' 
    });
    
    if (business) {
      return res.json({ success: true, hasActiveSubscription: true });
    }
    
    res.json({ success: true, hasActiveSubscription: false });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @desc    Get current user's events
// @route   GET /api/events/my-events
// @access  Private
router.get('/my-events', protect, async (req, res) => {
  try {
    const events = await Event.find({ ownerId: req.user._id }).populate('businessId').sort({ date: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all events for admin review (any status)
// @route   GET /api/events/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const events = await Event.find().populate('businessId').sort({ createdAt: -1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single event detail
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('businessId');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
 
// @desc    Register a new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, date, endDate, time, organizer, duration, price, paymentLink } = req.body;
 
    console.log('Event creation req.body:', req.body);

    if (!title || !category || !date || !endDate || !organizer) {
      const missing = [];
      if (!title) missing.push('title');
      if (!category) missing.push('category');
      if (!date) missing.push('date');
      if (!endDate) missing.push('endDate');
      if (!organizer) missing.push('organizer');
      console.warn('Event creation missing fields:', missing);
      return res.status(400).json({ 
        success: false, 
        message: `Please provide all required fields. Missing: ${missing.join(', ')}` 
      });
    }
 
    // Find user's business listing to link profile
    const userBusiness = await Business.findOne({ ownerId: req.user._id });
 
    const event = await Event.create({
      ownerId: req.user._id,
      businessId: userBusiness ? userBusiness._id : undefined,
      title,
      category,
      date: new Date(date),
      endDate: new Date(endDate),
      time: time || 'TBD',
      organizer,
      price: price !== undefined ? Number(price) : 0,
      paymentLink: paymentLink || '',
      duration: duration || '',
      status: 'Pending Review',
      isCompleted: false,
      paymentStatus: 'Pending',
      likes: [],
      comments: [],
    });
 
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating event:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update/Complete event registration
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check ownership
    if (event.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    const { description, venue, phone, coverImageUrl, paymentLink, isCompleted, paymentStatus, price, time } = req.body;

    if (description !== undefined) event.description = description;
    if (venue !== undefined) event.venue = venue;
    if (phone !== undefined) event.phone = phone;
    if (coverImageUrl !== undefined) event.coverImageUrl = coverImageUrl;
    if (paymentLink !== undefined) event.paymentLink = paymentLink;
    if (isCompleted !== undefined) event.isCompleted = isCompleted;
    if (paymentStatus !== undefined) event.paymentStatus = paymentStatus;
    if (price !== undefined) event.price = Number(price);
    if (time !== undefined) event.time = time;

    await event.save();

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Check ownership
    if (event.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Event successfully removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Toggle Like on an event listing
// @route   POST /api/events/:id/like
// @access  Public (Optional Auth)
router.post('/:id/like', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Extract authorization header to check if user is logged in
    let userIdStr = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ubt_jwt_secret_token_123456');
        userIdStr = decoded.id;
      } catch (err) {
        // Continue as guest
      }
    }

    // Determine unique identifier for liking (user ID or guest ID / IP / Fingerprint)
    const identifier = userIdStr || req.body.guestId || req.ip || req.headers['x-forwarded-for'] || 'guest_unknown';

    // Toggle identifier in likes array
    if (!event.likes) event.likes = [];
    const index = event.likes.indexOf(identifier);
    if (index === -1) {
      event.likes.push(identifier);
    } else {
      event.likes.splice(index, 1);
    }

    await event.save();
    
    // Check if the current identifier is present to determine if liked
    const isLiked = event.likes.includes(identifier);

    res.json({ success: true, likesCount: event.likes.length, isLiked, data: event.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add comment to an event
// @route   POST /api/events/:id/comment
// @access  Public (Optional Auth)
router.post('/:id/comment', async (req, res) => {
  try {
    const { text, userName: guestUserName } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Please provide comment text' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Extract authorization header to check if user is logged in
    let loggedInUser = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ubt_jwt_secret_token_123456');
        loggedInUser = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Continue as guest
      }
    }

    const comment = {
      text,
      createdAt: new Date()
    };

    if (loggedInUser) {
      comment.user = loggedInUser._id;
      comment.userName = loggedInUser.fullName || loggedInUser.name;
    } else {
      comment.userName = guestUserName || 'Anonymous Visitor';
    }

    if (!event.comments) event.comments = [];
    event.comments.push(comment);
    await event.save();

    res.json({ success: true, message: 'Comment added successfully', data: event.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete comment from an event
// @route   DELETE /api/events/:id/comment/:commentId
// @access  Private
router.delete('/:id/comment/:commentId', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Find the comment
    if (!event.comments) event.comments = [];
    const comment = event.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check authority: user must be comment creator OR event owner OR admin/superadmin
    const isCommentCreator = comment.user && req.user && comment.user.toString() === req.user._id.toString();
    const isEventOwner = event.ownerId && req.user && event.ownerId.toString() === req.user._id.toString();
    const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role);

    if (!isCommentCreator && !isEventOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Delete comment
    event.comments.pull(req.params.commentId);
    await event.save();

    res.json({ success: true, message: 'Comment deleted successfully', data: event.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
