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
          time: 'Sunday, 6:00 AM',
          venue: 'Udumalpet Town, Tamil Nadu',
          organizer: 'FitLife Club Udumalpet',
          phone: '+91 98945 67890',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=500&q=80'
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
          coverImageUrl: 'https://images.unsplash.com/photo-1608958416755-22d7d566f1ea?w=500&q=80'
        },
        {
          title: 'Udumalpet Startup Meet 2025',
          category: 'Business',
          description: 'A meetup for entrepreneurs, innovators and business enthusiasts.',
          date: new Date('2025-06-28T10:00:00'),
          time: 'Saturday, 10:00 AM',
          venue: 'Udumalpet IT Park',
          organizer: 'Udumalpet Startup Hub',
          phone: '+91 90035 67890',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=500&q=80'
        },
        {
          title: 'Carnatic Music Concert',
          category: 'Music',
          description: 'An evening of classical Carnatic music by renowned artists.',
          date: new Date('2025-07-05T18:30:00'),
          time: 'Saturday, 6:30 PM',
          venue: 'Sri Krishna Mahal, Udumalpet',
          organizer: 'Sangeetha Sabha',
          phone: '+91 98422 33445',
          price: 99,
          coverImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80'
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
    let query = {};

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
    let events = await Event.find(query).sort({ date: 1 });

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
    const events = await Event.find({ ownerId: req.user._id }).sort({ date: 1 });
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
    const events = await Event.find().sort({ createdAt: -1 });
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
    const event = await Event.findById(req.params.id);
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
    const { title, category, description, date, endDate, time, venue, organizer, phone, price, coverImageUrl, paymentLink, duration } = req.body;
 
    if (!title || !category || !description || !date || !time || !venue || !organizer || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }
 
    // Check if user has an active business subscription
    const activeBusiness = await Business.findOne({ 
      ownerId: req.user._id,
      subscriptionStatus: 'active' 
    });
    const finalPrice = activeBusiness ? 0 : 99;

    const event = await Event.create({
      ownerId: req.user._id,
      title,
      category,
      description,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : undefined,
      time,
      venue,
      organizer,
      phone,
      price: finalPrice,
      coverImageUrl: coverImageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500&q=80',
      paymentLink: paymentLink || '',
      duration: duration || '',
    });
 
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    console.error('Error creating event:', error.message);
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

module.exports = router;
