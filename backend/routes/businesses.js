const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Review = require('../models/Review');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// Allowed Udumalpet division pincodes and corresponding valid addresses for fraud verification
const validAddressesMap = {
  '642126': [
    'Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126',
    'Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126',
    'Eripalayam Main Road, Udumalpet Main Town, Tamil Nadu - 642126',
    'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126',
    'Gandhi Nagar Main Road, Udumalpet Main Town, Tamil Nadu - 642126'
  ],
  '642207': [
    'Erisinampatti Main Road, Pungamuthur, Tamil Nadu - 642207',
    'Devanurpudur Road, Pungamuthur, Tamil Nadu - 642207',
    'Vilamarathupatti Junction, Pungamuthur, Tamil Nadu - 642207',
    'Udukkampalayam Village, Pungamuthur, Tamil Nadu - 642207'
  ],
  '642154': [
    'Bodipatti Panchayat Ground Road, Bodipatti, Tamil Nadu - 642154',
    'Gandhi Nagar Road East, Udumalpet, Tamil Nadu - 642154',
    'Andiyagoundanur Village Road, Udumalpet, Tamil Nadu - 642154',
    'Kuralkuttai Road, Bodipatti, Tamil Nadu - 642154',
    'Thumbalapatti Village, Udumalpet, Tamil Nadu - 642154'
  ],
  '642112': [
    'Thirumoorthi Nagar Main Road, Dhali, Tamil Nadu - 642112',
    'Jallipatti Village Road, Dhali, Tamil Nadu - 642112',
    'Manupatti Bus Stop, Dhali, Tamil Nadu - 642112',
    'Kurichikottai Road, Dhali, Tamil Nadu - 642112'
  ],
  '642205': [
    'Kongalnagaram Main Road, Pethappampatti, Tamil Nadu - 642205',
    'Poosaripatti Village Road, Pethappampatti, Tamil Nadu - 642205',
    'Dhottampatti Road, Pethappampatti, Tamil Nadu - 642205'
  ],
  '642122': [
    'Anthiyur Road, Poolankinar, Tamil Nadu - 642122',
    'Ganapathipalayam Road, Poolankinar, Tamil Nadu - 642122',
    'Kodingium Village, Poolankinar, Tamil Nadu - 642122'
  ],
  '642204': [
    'Kolumam Main Road, Kolumam, Tamil Nadu - 642204',
    'Bazaar Street, Komaralingam, Tamil Nadu - 642204',
    'Samarayapatti Village Road, Komaralingam, Tamil Nadu - 642204',
    'Pappankulam Road, Kolumam, Tamil Nadu - 642204'
  ],
  '642201': [
    'Amandakadavoo Road, Gudimangalam, Tamil Nadu - 642201',
    'Kondampatti Road, Gudimangalam, Tamil Nadu - 642201',
    'Kottamangalam Road, Gudimangalam, Tamil Nadu - 642201'
  ],
  '642203': [
    'Kadathur Main Road, Kaniyur, Tamil Nadu - 642203',
    'Myvadi Junction Road, Kaniyur, Tamil Nadu - 642203',
    'Thungavi Road, Kaniyur, Tamil Nadu - 642203'
  ],
  '642102': [
    'Kallapuram Village Road, Amaravathi Nagar, Tamil Nadu - 642102',
    'Amaravathi Dam Area Road, Amaravathi Nagar, Tamil Nadu - 642102'
  ],
  '642128': [
    'Venkatesa Mills Colony, Udumalpet, Tamil Nadu - 642128',
    'S V Puram Post Road, Udumalpet, Tamil Nadu - 642128',
    'Pollachi Road, Udumalpet, Tamil Nadu - 642128'
  ],
  '642113': [
    'Solamadevi Road, Madathukulam, Tamil Nadu - 642113',
    'Sarkarkannadipudur Main Road, Madathukulam, Tamil Nadu - 642113'
  ],
  '642206': [
    'Aathukinathupatti Road, Poolavadi, Tamil Nadu - 642206',
    'Munduvelampatti Village, Poolavadi, Tamil Nadu - 642206'
  ],
  '642132': [
    'Dheepalapatti Village Road, Valavadi, Tamil Nadu - 642132',
    'Sundakkampalayam Road, Valavadi, Tamil Nadu - 642132'
  ],
  '642111': [
    'Agrahara Kannadiputhur Main Road, Tamil Nadu - 642111',
    'Krishnapuram Village Road, Tamil Nadu - 642111'
  ]
};

const allowedPincodes = Object.keys(validAddressesMap);

// @desc    Get all businesses with filters, search, and premium sorting
// @route   GET /api/businesses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { q, category, locality, rating, verified, type } = req.query;

    let query = {};

    // Only return approved or active businesses unless requested by owner/admin
    query.status = 'Approved';

    // Search query (matches name, description, services, brands)
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { services: { $elemMatch: { $regex: q, $options: 'i' } } },
        { brands: { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }

    // Category filter
    if (category && category !== 'All' && category !== 'All Categories') {
      const subcats = await Category.find({ parentCategory: category });
      if (subcats.length > 0) {
        const subcatNames = subcats.map(c => c.categoryName);
        query.category = { $in: [category, ...subcatNames] };
      } else {
        query.category = category;
      }
    }

    // Locality / Pincode filter
    if (locality && locality !== 'All' && locality !== 'Udumalpet') {
      query.$or = [
        { locality: { $regex: locality, $options: 'i' } },
        { pincode: locality },
      ];
    }

    // Verified check
    if (verified === 'true') {
      query.isAddressVerified = true;
    }

    // Business type (Premium / Verified)
    if (type === 'Premium') {
      query.isPremium = true;
    } else if (type === 'Verified') {
      query.isAddressVerified = true;
    }

    // Execute query
    let businesses = await Business.find(query);

    // Apply client-side/manual rating filter if specified (since rating is calculated or synced)
    if (rating) {
      const minRating = parseFloat(rating);
      businesses = businesses.filter(b => b.googleRating >= minRating);
    }

    // Update active vs expired subscriptions on the fly based on dates
    const now = new Date();
    businesses = businesses.map(b => {
      let bObj = b.toObject();
      if (bObj.subscriptionExpiry && new Date(bObj.subscriptionExpiry) < now) {
        bObj.subscriptionStatus = 'expired';
      }
      return bObj;
    });

    // Custom Sorting: 
    // 1. Premium + Active first
    // 2. Verified + Active second
    // 3. Subscription Expired lower rank
    // 4. Alphabetical / Newest
    businesses.sort((a, b) => {
      // Premium active vs others
      const aPremium = a.isPremium && a.subscriptionStatus === 'active';
      const bPremium = b.isPremium && b.subscriptionStatus === 'active';
      if (aPremium && !bPremium) return -1;
      if (!aPremium && bPremium) return 1;

      // Active vs Expired
      const aActive = a.subscriptionStatus === 'active';
      const bActive = b.subscriptionStatus === 'active';
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // Rating sort
      return b.googleRating - a.googleRating;
    });

    res.json({ success: true, count: businesses.length, data: businesses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/businesses/draft
// @desc    Get the current user's unpaid draft business listing
// @access  Private
router.get('/draft', protect, async (req, res) => {
  try {
    // Restrict access: Allow business owners, admins, and visitors/writers to view draft
    if (req.user.role !== 'owner' && req.user.role !== 'merchant' && req.user.role !== 'admin' && req.user.role !== 'visitor') {
      return res.status(403).json({ success: false, message: 'Access denied: Authorized role required' });
    }

    const listings = await Business.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    let business = null;

    if (listings.length > 1) {
      business = listings[0];
      const deleteIds = listings.slice(1).map(b => b._id);
      await Business.deleteMany({ _id: { $in: deleteIds } });
      console.log(`[DUPLICATE CLEANUP ON DRAFT] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
    } else if (listings.length === 1) {
      business = listings[0];
    }

    if (!business || business.subscriptionStatus === 'active') {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching draft:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/businesses/my-business
// @desc    Get the current user's business listing (regardless of status/subscription)
// @access  Private
router.get('/my-business', protect, async (req, res) => {
  try {
    // Restrict access: Allow business owners, admins, and visitors/writers to view
    if (req.user.role !== 'owner' && req.user.role !== 'merchant' && req.user.role !== 'admin' && req.user.role !== 'visitor') {
      return res.status(403).json({ success: false, message: 'Access denied: Authorized role required' });
    }

    // Merge/Clean duplicate entries for this owner
    const listings = await Business.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    let business = null;
    
    if (listings.length > 1) {
      business = listings[0]; // Keep the most recently created listing
      const deleteIds = listings.slice(1).map(b => b._id);
      await Business.deleteMany({ _id: { $in: deleteIds } });
      console.log(`[DUPLICATE CLEANUP] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
    } else if (listings.length === 1) {
      business = listings[0];
    }
    
    res.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching my-business:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get business details by ID
// @route   GET /api/businesses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.id || req.params.id);
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    let bObj = business.toObject();

    // Check expiry
    const now = new Date();
    if (bObj.subscriptionExpiry && new Date(bObj.subscriptionExpiry) < now) {
      bObj.subscriptionStatus = 'expired';
    }

    // Get reviews for this business
    const reviews = await Review.find({ businessId: business._id });
    bObj.reviews = reviews;

    // Apply restriction if expired
    if (bObj.subscriptionStatus === 'expired') {
      bObj.isRestricted = true;
      // Note: Front-end blurs images and hides WhatsApp, but let's send indicator
    }

    res.json({ success: true, data: bObj });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Invalid business ID format or server error' });
  }
});

// @desc    Create a new business listing (Pending Approval)
// @route   POST /api/businesses
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      description,
      yearEstablished,
      employeeCount,
      gstNumber,
      services,
      brands,
      phone,
      whatsapp,
      email,
      address,
      locality,
      pincode,
      isAddressVerified,
      logoUrl,
      coverImageUrl,
      galleryUrls,
      googlePlaceId,
      googleRating,
      googleReviewsCount,
      googleReviews,
      coordinates,
      timings,
      customCategoryName,
      categoryStatus
    } = req.body;

    // 0. Final validation of required fields
    if (!name || !category || !type || !description || !phone || !whatsapp || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Please fill in all required business profile details.',
      });
    }

    // 1. Pincode verification (mandatory server-side protection)
    if (!allowedPincodes.includes(pincode)) {
      return res.status(400).json({
        success: false,
        message: 'Registration rejected: Only allowed Udumalpet division area pincodes are permitted.',
      });
    }

    // 2. Address fraud prevention (relaxed to allow manual free-form street addresses)
    let finalAddressVerified = isAddressVerified;
    if (address && isAddressVerified) {
      const validAddresses = validAddressesMap[pincode] || [];
      if (!validAddresses.includes(address)) {
        finalAddressVerified = false;
        console.log(`[ADDRESS AUDIT] Free-form or custom address entered: "${address}". Placed in manual audit queue.`);
      }
    }

    // Restrict access: Allow business owners, admins, and visitors/writers to register a business
    if (req.user.role !== 'owner' && req.user.role !== 'merchant' && req.user.role !== 'admin' && req.user.role !== 'visitor') {
      return res.status(403).json({
        success: false,
        message: 'Registration denied: Authorized role required to register listings.',
      });
    }

    // Automatically upgrade visitor's role to merchant upon registering their business
    if (req.user.role === 'visitor') {
      const User = require('../models/User');
      await User.findByIdAndUpdate(req.user._id, { role: 'merchant' });
      req.user.role = 'merchant';
      console.log(`[ROLE UPGRADE] Upgraded user ${req.user._id} role from visitor to merchant upon registering business.`);
    }

    // Merge/Clean duplicates first to make sure there is at most one business listing
    const listings = await Business.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    let business = null;
    if (listings.length > 0) {
      business = listings[0];
      if (listings.length > 1) {
        const deleteIds = listings.slice(1).map(b => b._id);
        await Business.deleteMany({ _id: { $in: deleteIds } });
        console.log(`[DUPLICATE CLEANUP ON CREATE] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
      }
    }

    const updateData = {
      name,
      category,
      type,
      description,
      yearEstablished,
      employeeCount,
      gstNumber,
      services: services || [],
      brands: brands || [],
      phone,
      whatsapp,
      email,
      address,
      locality,
      pincode,
      isAddressVerified: finalAddressVerified, // set to match verified status
      logoUrl: logoUrl || '',
      coverImageUrl: coverImageUrl || '',
      galleryUrls: galleryUrls || [],
      googlePlaceId: googlePlaceId || '',
      googleRating: googleRating || 0,
      googleReviewsCount: googleReviewsCount || 0,
      googleReviews: googleReviews || [],
      coordinates: coordinates || { lat: 10.585, lng: 77.251 },
      timings: timings || {
        Monday: '9:00 AM - 8:00 PM',
        Tuesday: '9:00 AM - 8:00 PM',
        Wednesday: '9:00 AM - 8:00 PM',
        Thursday: '9:00 AM - 8:00 PM',
        Friday: '9:00 AM - 8:00 PM',
        Saturday: '9:00 AM - 8:00 PM',
        Sunday: '9:00 AM - 1:00 PM',
      },
      status: 'Pending Verification', // Reset status to pending verification upon submission
      customCategoryName: customCategoryName || undefined,
      categoryStatus: categoryStatus || undefined,
    };

    if (business) {
      if (business.subscriptionStatus === 'active') {
        return res.status(400).json({
          success: false,
          message: 'This business registration has already been finalized and subscription is active.',
        });
      }
      Object.assign(business, updateData);
      await business.save();
    } else {
      business = await Business.create({
        ownerId: req.user._id,
        ...updateData,
      });
    }

    res.status(201).json({ success: true, data: business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Update a business listing
// @route   PUT /api/businesses/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Verify owner or admin
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    // Check pincode constraint if modifying
    if (req.body.pincode) {
      if (!allowedPincodes.includes(req.body.pincode)) {
        return res.status(400).json({
          success: false,
          message: 'Registration rejected: Only allowed Udumalpet division area pincodes are permitted.',
        });
      }
    }

    // Fraud address verification on update (relaxed to allow free-form addresses)
    if (req.body.address || req.body.pincode) {
      const checkPincode = req.body.pincode || business.pincode;
      const checkAddress = req.body.address || business.address;
      const isVerified = req.body.isAddressVerified !== undefined ? req.body.isAddressVerified : business.isAddressVerified;
      
      if (isVerified) {
        const validAddresses = validAddressesMap[checkPincode] || [];
        if (!validAddresses.includes(checkAddress)) {
          req.body.isAddressVerified = false;
          console.log(`[ADDRESS AUDIT UPDATE] Free-form or custom address updated: "${checkAddress}". Set verified to false.`);
        }
      }
    }

    // Do not allow updating status or subscription via standard PUT (must be approved via Admin or Payments routes)
    delete req.body.status;
    delete req.body.subscriptionStatus;
    delete req.body.subscriptionExpiry;
    delete req.body.isPremium;

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Mock Google Business Auto-Fill API
// @route   POST /api/businesses/google-autofill
// @access  Private
router.post('/google-autofill', protect, async (req, res) => {
  try {
    const { nameOrUrl } = req.body;
    if (!nameOrUrl) {
      return res.status(400).json({ success: false, message: 'Business Name or Maps link is required' });
    }

    console.log(`Auto-fill triggered for: ${nameOrUrl}`);

    // If a Google API key is provided, we could use Google Places API, 
    // otherwise we provide gorgeous realistic mock details of famous Udumalpet businesses.
    const cleanSearch = nameOrUrl.toLowerCase().trim();

    let autofillData = {
      name: 'New Udumalpet Enterprise',
      address: 'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      email: 'info@newudumalpet.in',
      locality: 'Dharapuram Road',
      pincode: '642126',
      yearEstablished: 2020,
      employeeCount: '5 - 10',
      services: ['Customer Support', 'Local Delivery'],
      brands: ['Generic'],
      isAddressVerified: true,
      googlePlaceId: 'ChIJUdumalpetPlaceId_' + Math.random().toString(36).substr(2, 9),
      googleRating: 4.5,
      googleReviewsCount: 24,
      googleReviews: [
        { authorName: 'Subramanian K.', rating: 5, text: 'Excellent quick service in the center of Udumalpet.' },
        { authorName: 'Priya R.', rating: 4, text: 'Friendly staff and reasonable prices. Highly recommended!' },
      ],
      coordinates: { lat: 10.584, lng: 77.252 },
      timings: {
        Monday: '9:00 AM - 8:00 PM',
        Tuesday: '9:00 AM - 8:00 PM',
        Wednesday: '9:00 AM - 8:00 PM',
        Thursday: '9:00 AM - 8:00 PM',
        Friday: '9:00 AM - 8:00 PM',
        Saturday: '9:00 AM - 8:00 PM',
        Sunday: 'Closed',
      },
    };

    if (cleanSearch.includes('murugan') || cleanSearch.includes('stores')) {
      autofillData = {
        name: 'Sri Murugan Stores',
        address: 'Gandhi Nagar Main Road, Udumalpet Main Town, Tamil Nadu - 642126',
        phone: '+91 94430 12345',
        whatsapp: '+91 94430 12345',
        email: 'contact@muruganstores.com',
        locality: 'Gandhi Nagar',
        pincode: '642126',
        yearEstablished: 1998,
        employeeCount: '20 - 50',
        services: ['Departmental Stores', 'Home Delivery', 'Organic Pulses', 'Fresh Vegetables'],
        brands: ['Aashirvaad', 'Tata', 'Dhanya', 'Udhayam'],
        isAddressVerified: true,
        googlePlaceId: 'ChIJSriMuruganStores10024',
        googleRating: 4.6,
        googleReviewsCount: 128,
        googleReviews: [
          { authorName: 'Karthik S.', rating: 5, text: 'Best quality grocery shop in Gandhi Nagar. They have fresh organic goods always.' },
          { authorName: 'Manoj Kumar', rating: 4, text: 'Excellent quick delivery. Highly cooperative staff and wide range of items.' },
          { authorName: 'Revathi Devi', rating: 5, text: 'My family has been buying here for 15 years. Superb response and great offers!' },
        ],
        coordinates: { lat: 10.5878, lng: 77.2485 },
      };
    } else if (cleanSearch.includes('green valley') || cleanSearch.includes('hotel') || cleanSearch.includes('valley')) {
      autofillData = {
        name: 'Green Valley Hotel',
        address: 'Pollachi Road, Udumalpet, Tamil Nadu - 642128',
        phone: '+91 98945 99999',
        whatsapp: '+91 98945 99999',
        email: 'reservations@greenvalleyhotel.in',
        locality: 'Pollachi Road',
        pincode: '642128',
        yearEstablished: 2010,
        employeeCount: '10 - 20',
        services: ['Hotels & Restaurants', 'Pure Vegetarian Food', 'AC Banquet Hall', 'Party Orders', 'Home Delivery'],
        brands: ['South Indian Meals', 'North Indian Delicacies', 'Tandoor Special'],
        isAddressVerified: true,
        googlePlaceId: 'ChIJGreenValleyHotel129',
        googleRating: 4.8,
        googleReviewsCount: 98,
        googleReviews: [
          { authorName: 'Anitha R.', rating: 5, text: 'Delicious pure vegetarian food. Clean and highly hygienic environment.' },
          { authorName: 'Karthikeyan P.', rating: 4, text: 'Nice parking space and superb service. Try their special Ghee Roast!' },
        ],
        coordinates: { lat: 10.5823, lng: 77.2341 },
      };
    } else if (cleanSearch.includes('r.k. electricals') || cleanSearch.includes('rk electricals') || cleanSearch.includes('electricals')) {
      autofillData = {
        name: 'R.K. Electricals',
        address: 'Pollachi Road, Udumalpet, Tamil Nadu - 642128',
        phone: '+91 98945 43100',
        whatsapp: '+91 98945 43100',
        email: 'rkelectricals@gmail.com',
        locality: 'Pollachi Road',
        pincode: '642128',
        yearEstablished: 2012,
        employeeCount: '10 - 20',
        services: ['Electrical Services', 'Home Wiring', 'Electrical Repairs', 'Inverter & Battery Setup', 'CCTV Installation', 'MCB Switch Board Setup'],
        brands: ['Havells', 'Finolex', 'Legrand', 'Syska', 'Anchor'],
        isAddressVerified: true,
        googlePlaceId: 'ChIJRKElectricalsUdt',
        googleRating: 4.7,
        googleReviewsCount: 84,
        googleReviews: [
          { authorName: 'Karthik S.', rating: 5, text: 'Excellent service! They came on time and fixed the inverter issue quickly. Very professional.' },
          { authorName: 'Manoj Kumar', rating: 4, text: 'Good work and polite staff. They explained the issue clearly and did a neat job.' },
          { authorName: 'Revathi Devi', rating: 5, text: 'Very reliable service for home electrical work. Highly recommended!' },
        ],
        coordinates: { lat: 10.5802, lng: 77.2319 },
      };
    } else if (cleanSearch.includes('hospital') || cleanSearch.includes('city hospital')) {
      autofillData = {
        name: 'City Hospital',
        address: 'Dharapuram Road, Udumalpet Main Town, Tamil Nadu - 642126',
        phone: '+91 4252 223456',
        whatsapp: '+91 98425 22345',
        email: 'info@cityhospitaludumalpet.com',
        locality: 'Dharapuram Road',
        pincode: '642126',
        yearEstablished: 2005,
        employeeCount: '50 - 100',
        services: ['General Medicine', 'Pediatrics', '24x7 Emergency Care', 'Pharmacy', 'Lab Diagnostics', 'Ultrasound'],
        brands: ['Emergency ICU', 'Specialist Clinics'],
        isAddressVerified: true,
        googlePlaceId: 'ChIJCityHospitalUdt',
        googleRating: 4.5,
        googleReviewsCount: 206,
        googleReviews: [
          { authorName: 'Ramesh Krishnan', rating: 5, text: 'One of the best emergency care facilities in Udumalpet. Attentive doctors.' },
          { authorName: 'Sundari M.', rating: 4, text: 'Very clean rooms and systematic response in the outpatient department.' },
        ],
        coordinates: { lat: 10.584, lng: 77.252 },
      };
    }

    res.json({ success: true, data: autofillData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/businesses/draft
// @desc    Save or update business draft progress
// @access  Private
router.post('/draft', protect, async (req, res) => {
  try {
    const fields = req.body;
    
    // Find existing business for this user
    let business = await Business.findOne({ ownerId: req.user._id });
    
    if (business) {
      // If the business is already paid, don't allow modifying it via draft
      if (business.subscriptionStatus === 'active') {
        return res.status(400).json({ success: false, message: 'Cannot edit an active paid listing via draft.' });
      }
      
      // Update existing draft
      Object.assign(business, fields);
      await business.save();
    } else {
      // Create new draft
      business = new Business({
        ownerId: req.user._id,
        ...fields,
        status: 'Pending Verification',
        subscriptionStatus: 'none',
      });
      await business.save();
    }
    
    res.json({ success: true, data: business });
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Sync Google business parameters
// @route   POST /api/businesses/:id/sync-google
// @access  Private
const { syncGoogleBusiness } = require('../controllers/businessController');
router.post('/:id/sync-google', protect, syncGoogleBusiness);

module.exports = router;
