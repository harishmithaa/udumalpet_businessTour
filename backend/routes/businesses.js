const express = require('express');
const router = express.Router();
const Business = require('../models/Business');
const Review = require('../models/Review');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// Synchronize branches as child Business documents
async function syncBranches(parentBusiness, branchesData, userRole) {
  if (!branchesData || !Array.isArray(branchesData)) return;

  const existingBranches = await Business.find({ parentBusinessId: parentBusiness._id });
  const existingIds = existingBranches.map(b => b._id.toString());
  const incomingIds = [];

  const status = userRole === 'admin' ? 'Approved' : 'Pending Verification';

  for (const b of branchesData) {
    const bId = b._id || b.id;
    const branchFields = {
      name: b.name,
      businessName: b.name,
      address: b.address,
      phone: b.phone,
      whatsapp: b.whatsapp || parentBusiness.whatsapp,
      email: b.email || parentBusiness.email,
      website: b.website || parentBusiness.website,
      instagram: b.instagram || parentBusiness.instagram,
      facebook: b.facebook || parentBusiness.facebook,
      googleMapsLocation: b.googleMapsLocation,
      googleBusinessLink: b.googleBusinessLink,
      workingHours: b.workingHours,
      branchManagerName: b.branchManagerName,
      latitude: b.latitude || b.coordinates?.lat || 10.5891,
      longitude: b.longitude || b.coordinates?.lng || 77.2412,
      coordinates: {
        lat: b.latitude || b.coordinates?.lat || 10.5891,
        lng: b.longitude || b.coordinates?.lng || 77.2412
      },
      category: parentBusiness.category,
      categoryId: parentBusiness.categoryId,
      type: parentBusiness.type,
      ownerId: parentBusiness.ownerId,
      parentBusinessId: parentBusiness._id,
      businessId: parentBusiness._id,
      status: b.status || status,
    };

    if (bId && existingIds.includes(bId.toString())) {
      incomingIds.push(bId.toString());
      await Business.findByIdAndUpdate(bId, branchFields, { new: true });
    } else {
      const newBranch = await Business.create(branchFields);
      incomingIds.push(newBranch._id.toString());
    }
  }

  // Delete branches that are no longer in the list
  const toDelete = existingIds.filter(id => !incomingIds.includes(id));
  if (toDelete.length > 0) {
    await Business.deleteMany({ _id: { $in: toDelete } });
  }
}

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

// Haversine distance calculator
function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// ==========================================
// GEOCODING & BOUNDARY VALIDATION
// ==========================================
// This function validates that a business address falls within our permitted 35km radius 
// around Udumalpet's town center (10.5891, 77.2412) using the Haversine distance formula.
//
// API Integration:
// - Uses the Google Geocoding API to resolve the address string into latitude/longitude coordinates.
// - Secures the query with the GOOGLE_MAPS_API_KEY environment variable.
// - Supports a local mock fallback in case the API key is not configured in .env.
async function validateAddressAndBoundary(address, pincode, userLat, userLng) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const udtCenter = { lat: 10.5891, lng: 77.2412 };
  const { APPROVED_PINCODES } = require('../constants/pincodes');
  
  if (!APPROVED_PINCODES.includes(pincode)) {
    return {
      isValid: false,
      message: `Pincode "${pincode}" is outside Udumalpet operational boundaries. Authorized Udumalpet pincodes are: ${APPROVED_PINCODES.join(', ')}.`
    };
  }

  let lat = parseFloat(userLat) || udtCenter.lat;
  let lng = parseFloat(userLng) || udtCenter.lng;

  if (apiKey) {
    try {
      const fullAddressQuery = `${address}, Tamil Nadu, India, ${pincode}`;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddressQuery)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const location = result.geometry.location;
        lat = location.lat;
        lng = location.lng;

        let geocodedPincode = '';
        for (const comp of result.address_components) {
          if (comp.types.includes('postal_code')) {
            geocodedPincode = comp.long_name;
            break;
          }
        }

        if (geocodedPincode && geocodedPincode !== pincode && !APPROVED_PINCODES.includes(geocodedPincode)) {
          return {
            isValid: false,
            message: `Geocoded address postal code (${geocodedPincode}) is not within the approved Udumalpet region.`
          };
        }
      } else {
        console.warn(`Geocoding API returned status: ${data.status || 'EMPTY'}. Using fallback coordinates.`);
      }
    } catch (error) {
      console.error('Error during Geocoding API call:', error.message);
    }
  }

  const distance = getHaversineDistance(lat, lng, udtCenter.lat, udtCenter.lng);
  if (distance > 35) {
    return {
      isValid: false,
      message: `The address location is ${distance.toFixed(1)} km away from Udumalpet center, which exceeds the allowed 35 km service area.`
    };
  }

  return {
    isValid: true,
    lat,
    lng
  };
}

// Google Autocomplete Mock Suggestions
const mockSuggestions = [
  {
    description: "R.K. Electricals, Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126",
    place_id: "mock_place_rk_electricals",
    structured_formatting: {
      main_text: "R.K. Electricals",
      secondary_text: "Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126"
    }
  },
  {
    description: "Hotel Annapoorna, Coimbatore Road, Udumalpet, Tamil Nadu - 642128",
    place_id: "mock_place_hotel_annapoorna",
    structured_formatting: {
      main_text: "Hotel Annapoorna",
      secondary_text: "Coimbatore Road, Udumalpet, Tamil Nadu - 642128"
    }
  },
  {
    description: "Royal Textiles, Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126",
    place_id: "mock_place_royal_textiles",
    structured_formatting: {
      main_text: "Royal Textiles",
      secondary_text: "Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126"
    }
  }
];

// Google Address Autocomplete Mock Suggestions
const mockAddressSuggestions = [
  {
    description: "Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126",
    place_id: "mock_addr_head_post_office",
    structured_formatting: {
      main_text: "Head Post Office Road",
      secondary_text: "Udumalpet Main Town, Tamil Nadu - 642126"
    }
  },
  {
    description: "Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126",
    place_id: "mock_addr_bazaar_street",
    structured_formatting: {
      main_text: "Bazaar Street",
      secondary_text: "Udumalpet Main Town, Tamil Nadu - 642126"
    }
  },
  {
    description: "Coimbatore Road, Udumalpet, Tamil Nadu - 642128",
    place_id: "mock_addr_coimbatore_road",
    structured_formatting: {
      main_text: "Coimbatore Road",
      secondary_text: "Udumalpet, Tamil Nadu - 642128"
    }
  }
];

// Google Place Details Mock Data
const mockDetails = {
  mock_place_rk_electricals: {
    name: "R.K. Electricals",
    address: "Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126",
    phone: "+91 98765 43210",
    website: "https://rkelectricals.com",
    latitude: 10.5895,
    longitude: 77.2420,
    googlePlaceId: "mock_place_rk_electricals",
    googleRating: 4.5,
    googleReviewsCount: 120,
    googleReviews: [
      { authorName: "Arun Kumar", rating: 5, text: "Excellent shop for electrical supplies. Reasonable prices and good behavior.", createdAt: new Date() },
      { authorName: "Meena S", rating: 4, text: "Good range of electric accessories. Very cooperative staff.", createdAt: new Date() }
    ],
    openingHours: {
      Monday: "9:00 AM - 8:00 PM",
      Tuesday: "9:00 AM - 8:00 PM",
      Wednesday: "9:00 AM - 8:00 PM",
      Thursday: "9:00 AM - 8:00 PM",
      Friday: "9:00 AM - 8:00 PM",
      Saturday: "9:00 AM - 8:00 PM",
      Sunday: "Closed"
    }
  },
  mock_place_hotel_annapoorna: {
    name: "Hotel Annapoorna",
    address: "Coimbatore Road, Udumalpet, Tamil Nadu - 642128",
    phone: "+91 94432 10987",
    website: "https://hotelannapoornaudt.com",
    latitude: 10.5921,
    longitude: 77.2398,
    googlePlaceId: "mock_place_hotel_annapoorna",
    googleRating: 4.2,
    googleReviewsCount: 850,
    googleReviews: [
      { authorName: "Karthik R", rating: 5, text: "Best South Indian breakfast in Udumalpet! Sambar is outstanding.", createdAt: new Date() },
      { authorName: "Divya N", rating: 4, text: "Tasty vegetarian food, quick service, but crowded during peak hours.", createdAt: new Date() }
    ],
    openingHours: {
      Monday: "7:00 AM - 10:30 PM",
      Tuesday: "7:00 AM - 10:30 PM",
      Wednesday: "7:00 AM - 10:30 PM",
      Thursday: "7:00 AM - 10:30 PM",
      Friday: "7:00 AM - 10:30 PM",
      Saturday: "7:00 AM - 10:30 PM",
      Sunday: "7:00 AM - 10:30 PM"
    }
  },
  mock_place_royal_textiles: {
    name: "Royal Textiles",
    address: "Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126",
    phone: "+91 81223 94455",
    website: "https://royaltextilesudt.business.site",
    latitude: 10.5880,
    longitude: 77.2450,
    googlePlaceId: "mock_place_royal_textiles",
    googleRating: 4.7,
    googleReviewsCount: 320,
    googleReviews: [
      { authorName: "Sanjay Kumar", rating: 5, text: "Superb collection of ethnic wear and sarees. High quality material.", createdAt: new Date() },
      { authorName: "Rani P", rating: 4, text: "Affordable clothing range. Courteous staff. Clean showroom.", createdAt: new Date() }
    ],
    openingHours: {
      Monday: "9:30 AM - 9:30 PM",
      Tuesday: "9:30 AM - 9:30 PM",
      Wednesday: "9:30 AM - 9:30 PM",
      Thursday: "9:30 AM - 9:30 PM",
      Friday: "9:30 AM - 9:30 PM",
      Saturday: "9:30 AM - 9:30 PM",
      Sunday: "9:30 AM - 9:30 PM"
    }
  },
  mock_addr_head_post_office: {
    name: "Head Post Office Road",
    address: "Head Post Office Road, Udumalpet Main Town, Tamil Nadu - 642126",
    latitude: 10.5862,
    longitude: 77.2472,
    pincode: "642126",
    locality: "Head Post Office",
    googlePlaceId: "mock_addr_head_post_office"
  },
  mock_addr_bazaar_street: {
    name: "Bazaar Street",
    address: "Bazaar Street, Udumalpet Main Town, Tamil Nadu - 642126",
    latitude: 10.5855,
    longitude: 77.2495,
    pincode: "642126",
    locality: "Bazaar Street",
    googlePlaceId: "mock_addr_bazaar_street"
  },
  mock_addr_coimbatore_road: {
    name: "Coimbatore Road",
    address: "Coimbatore Road, Udumalpet, Tamil Nadu - 642128",
    latitude: 10.5921,
    longitude: 77.2398,
    pincode: "642128",
    locality: "coimbatore road",
    googlePlaceId: "mock_addr_coimbatore_road"
  }
};

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
      query.$or = [
        { googlePlaceId: { $exists: true, $ne: '' } },
        { googleBusinessLink: { $exists: true, $ne: '' } },
        { googleLinked: true }
      ];
    }

    // Business type (Premium / Verified)
    if (type === 'Premium') {
      query.isPremium = true;
    } else if (type === 'Verified') {
      query.$or = [
        { googlePlaceId: { $exists: true, $ne: '' } },
        { googleBusinessLink: { $exists: true, $ne: '' } },
        { googleLinked: true }
      ];
    }

    // Execute query
    let businesses = await Business.find(query);

    // Apply client-side/manual rating filter if specified (since rating is calculated or synced)
    if (rating) {
      const minRating = parseFloat(rating);
      businesses = businesses.filter(b => b.googleRating >= minRating);
    }

    // Update active vs expired subscriptions on the fly, inherit parent subscription for branches, and attach branchCount
    const now = new Date();
    const businessesWithCounts = await Promise.all(businesses.map(async (b) => {
      let bObj = b.toObject();

      // Inherit subscription details from parent if it is a branch
      if (bObj.parentBusinessId) {
        const parent = await Business.findById(bObj.parentBusinessId);
        if (parent) {
          bObj.subscriptionStatus = parent.subscriptionStatus;
          bObj.subscriptionExpiry = parent.subscriptionExpiry;
          bObj.isPremium = parent.isPremium;
        }
      }

      if (bObj.subscriptionExpiry && new Date(bObj.subscriptionExpiry) < now) {
        bObj.subscriptionStatus = 'expired';
      }
      bObj.branchCount = await Business.countDocuments({ parentBusinessId: b._id, status: 'Approved' });
      return bObj;
    }));
    businesses = businessesWithCounts;

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

    const isTestUser = 
      (req.user && (
        req.user.email === 'test@gmail.com' || 
        req.user.name === 'xxx' || 
        req.user.fullName === 'xxx' || 
        req.user.phone === '1234567891' || 
        req.user.mobileNumber === '1234567891'
      ));

    if (listings.length > 1) {
      business = listings[0];
      if (!isTestUser) {
        const deleteIds = listings.slice(1).map(b => b._id);
        await Business.deleteMany({ _id: { $in: deleteIds } });
        console.log(`[DUPLICATE CLEANUP ON DRAFT] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
      }
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

    // Merge/Clean duplicate entries for this owner (only for primary listings, not branches)
    const listings = await Business.find({
      ownerId: req.user._id,
      $or: [{ parentBusinessId: null }, { parentBusinessId: { $exists: false } }]
    }).sort({ createdAt: -1 });
    let business = null;
    
    const isTestUser = 
      (req.user && (
        req.user.email === 'test@gmail.com' || 
        req.user.name === 'xxx' || 
        req.user.fullName === 'xxx' || 
        req.user.phone === '1234567891' || 
        req.user.mobileNumber === '1234567891'
      ));

    if (listings.length > 1) {
      business = listings[0]; // Keep the most recently created listing
      if (!isTestUser) {
        const deleteIds = listings.slice(1).map(b => b._id);
        await Business.deleteMany({ _id: { $in: deleteIds } });
        console.log(`[DUPLICATE CLEANUP] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
      }
    } else if (listings.length === 1) {
      business = listings[0];
    }
    
    res.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching my-business:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// GOOGLE PLACES AUTOCOMPLETE API
// ==========================================
// This endpoint interfaces with the Google Places Autocomplete service to provide
// instant real-time predictions as a business owner types their store name.
//
// Key Details:
// - Restricts results to Country: India ('components=country:in').
// - Supports both 'establishment' (businesses) and 'geocode' (street addresses) queries.
// - Resolves environment variable GOOGLE_MAPS_API_KEY.
// - Dynamically falls back to local high-quality mock data if API key is not configured.
// @desc    Google Places Autocomplete
// @route   GET /api/businesses/google-autocomplete
// @access  Public
router.get('/google-autocomplete', async (req, res) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const q = req.query.q || '';
  const types = req.query.types || 'establishment';

  const clean = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isGeocodeSearch = types === 'geocode' || types === 'address';
  const targetSuggestions = isGeocodeSearch ? mockAddressSuggestions : mockSuggestions;

  if (!apiKey) {
    const qClean = clean(q);
    const filtered = targetSuggestions.filter(s => 
      clean(s.structured_formatting?.main_text || '').includes(qClean) ||
      clean(s.description || '').includes(qClean)
    );
    return res.json({ success: true, predictions: filtered });
  }

  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat'
      },
      body: JSON.stringify({
        input: q,
        includedRegionCodes: ['in']
      })
    });
    
    const data = await response.json();
    
    if (data && data.suggestions) {
      const predictions = data.suggestions.map(sug => {
        const p = sug.placePrediction || {};
        return {
          place_id: p.placeId || '',
          description: p.text?.text || '',
          structured_formatting: {
            main_text: p.structuredFormat?.mainText?.text || p.text?.text || '',
            secondary_text: p.structuredFormat?.secondaryText?.text || ''
          }
        };
      });
      return res.json({ success: true, predictions });
    } else {
      console.warn(`Google Places API (New) Autocomplete failed: ${JSON.stringify(data)}. Falling back to mock suggestions.`);
      const qClean = clean(q);
      const filtered = targetSuggestions.filter(s => 
        clean(s.structured_formatting?.main_text || '').includes(qClean) ||
        clean(s.description || '').includes(qClean)
      );
      return res.json({ success: true, predictions: filtered });
    }
  } catch (error) {
    console.error('Autocomplete API error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// GOOGLE PLACES DETAIL IMPORT API
// ==========================================
// This endpoint fetches full detailed information for a specific Place ID, mapping
// opening hours, formatted phone, address locality components, websites, coordinates, and reviews.
//
// Key Details:
// - Imports Google Reviews (author name, rating score, reviews text content).
// - Transforms Google Opening Hours (weekday_text) to the UBT timings schema.
// - Supports a local mock fallback when a mock ID is supplied or environment key is missing.
// @desc    Google Places Auto-fill Details
// @route   POST /api/businesses/google-autofill
// @access  Public
router.post('/google-autofill', async (req, res) => {
  const { placeId } = req.body;
  if (!placeId) {
    return res.status(400).json({ success: false, message: 'placeId is required' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || mockDetails[placeId] || placeId.startsWith('mock_place_') || placeId.startsWith('mock_addr_')) {
    const detail = mockDetails[placeId] || mockDetails['mock_place_rk_electricals'];
    return res.json({ success: true, data: detail });
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,nationalPhoneNumber,websiteUri,location,regularOpeningHours,rating,userRatingCount,reviews,addressComponents'
      }
    });

    const result = await response.json();
    
    if (result.error) {
      console.warn(`Google Place Details API (New) error: ${result.error.message}. Falling back to mock details.`);
      const detail = mockDetails[placeId] || mockDetails['mock_place_rk_electricals'];
      return res.json({ success: true, data: detail });
    }

    const lat = result.location?.latitude || 10.585;
    const lng = result.location?.longitude || 77.251;

    let pincode = '';
    let locality = '';
    if (result.addressComponents) {
      for (const comp of result.addressComponents) {
        if (comp.types.includes('postal_code')) {
          pincode = comp.longText;
        }
        if (comp.types.includes('sublocality') || comp.types.includes('neighborhood')) {
          locality = comp.longText;
        } else if (!locality && comp.types.includes('locality')) {
          locality = comp.longText;
        }
      }
    }

    const cleanTimingStr = (str) => str.replace(/[\u2013\u2014\u2012\u2010]/g, '-').replace(/[\u202F\u00A0]/g, ' ').trim();

    const timings = {
      Monday: '9:00 AM - 8:00 PM',
      Tuesday: '9:00 AM - 8:00 PM',
      Wednesday: '9:00 AM - 8:00 PM',
      Thursday: '9:00 AM - 8:00 PM',
      Friday: '9:00 AM - 8:00 PM',
      Saturday: '9:00 AM - 8:00 PM',
      Sunday: 'Closed',
    };

    if (result.regularOpeningHours && result.regularOpeningHours.weekdayDescriptions) {
      for (const text of result.regularOpeningHours.weekdayDescriptions) {
        const parts = text.split(': ');
        if (parts.length >= 2) {
          const day = parts[0];
          const hours = cleanTimingStr(parts.slice(1).join(': '));
          if (timings.hasOwnProperty(day)) {
            timings[day] = hours;
          }
        }
      }
    }

    // Reviews from Places API (New) — may be empty if billing tier doesn't include reviews
    let googleReviews = (result.reviews || []).map(r => ({
      authorName: r.authorAttribution?.displayName || 'A Google User',
      rating: r.rating || 0,
      text: r.text?.text || '',
      createdAt: r.publishTime ? new Date(r.publishTime) : new Date(),
    }));

    // Fallback: use legacy Places Details API to get reviews when new API returns none
    if (googleReviews.length === 0) {
      try {
        const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
        const legacyResp = await fetch(legacyUrl);
        const legacyData = await legacyResp.json();
        if (legacyData.status === 'OK' && legacyData.result?.reviews) {
          googleReviews = legacyData.result.reviews.slice(0, 5).map(r => ({
            authorName: r.author_name || 'A Google User',
            rating: r.rating || 0,
            text: r.text || '',
            createdAt: new Date(r.time * 1000),
          }));
          console.log(`[Autofill] Fetched ${googleReviews.length} reviews via legacy Places API for ${placeId}`);
        }
      } catch (legacyErr) {
        console.warn('[Autofill] Legacy Places reviews fetch failed:', legacyErr.message);
      }
    }

    const detail = {
      name: result.displayName?.text || '',
      address: result.formattedAddress || '',
      phone: result.nationalPhoneNumber || '',
      website: result.websiteUri || '',
      latitude: lat,
      longitude: lng,
      googlePlaceId: placeId,
      googleRating: result.rating || 0,
      googleReviewsCount: result.userRatingCount || 0,
      googleReviews,
      openingHours: timings,
      timings,
      pincode,
      locality
    };

    res.json({ success: true, data: detail });
  } catch (error) {
    console.error('Google Place Details error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// @desc    Validate Address and Boundaries
// @route   POST /api/businesses/validate-address
// @access  Public
router.post('/validate-address', async (req, res) => {
  const { address, locality, pincode, latitude, longitude } = req.body;

  if (!pincode) {
    return res.status(400).json({ success: false, message: 'Pincode is required' });
  }

  const { APPROVED_PINCODES } = require('../constants/pincodes');
  if (!APPROVED_PINCODES.includes(pincode)) {
    return res.json({
      success: true,
      isAddressValid: false,
      isWithinBoundary: false,
      message: `Pincode "${pincode}" is outside Udumalpet operational boundaries.`
    });
  }

  const udtCenter = { lat: 10.5891, lng: 77.2412 };
  const userLat = parseFloat(latitude) || udtCenter.lat;
  const userLng = parseFloat(longitude) || udtCenter.lng;

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  let geocodedLat = userLat;
  let geocodedLng = userLng;
  let isAddressValid = true;
  let matchMessage = "Address, pincode and coordinates match.";

  if (apiKey) {
    try {
      const fullAddressQuery = `${address || ''} ${locality || ''}, Tamil Nadu, India, ${pincode}`;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddressQuery)}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        geocodedLat = result.geometry.location.lat;
        geocodedLng = result.geometry.location.lng;

        // Check distance between geocoded location and user input coordinates
        const distFromInput = getHaversineDistance(geocodedLat, geocodedLng, userLat, userLng);
        if (distFromInput > 5) {
          isAddressValid = false;
          matchMessage = `Coordinates are ${distFromInput.toFixed(1)} km away from the geocoded address location. Please align the coordinates.`;
        }

        // Verify pincode in geocoded components
        let geocodedPincode = '';
        for (const comp of result.address_components) {
          if (comp.types.includes('postal_code')) {
            geocodedPincode = comp.long_name;
            break;
          }
        }
        if (geocodedPincode && geocodedPincode !== pincode && !APPROVED_PINCODES.includes(geocodedPincode)) {
          isAddressValid = false;
          matchMessage = `Address pincode mismatch: geocoded pincode is ${geocodedPincode}.`;
        }
      } else {
        isAddressValid = false;
        matchMessage = `Address could not be validated by Google Geocoding API (Status: ${data.status}).`;
      }
    } catch (error) {
      console.error('Error during validation geocoding:', error.message);
    }
  } else {
    // Mock Validation Fallback (pincode already verified above, check if address is not completely empty)
    if (!address || address.length < 5) {
      isAddressValid = false;
      matchMessage = "Address is too short to validate.";
    }
  }

  // Calculate distance to Udumalpet center
  const distFromCenter = getHaversineDistance(geocodedLat, geocodedLng, udtCenter.lat, udtCenter.lng);
  const isWithinBoundary = distFromCenter <= 35;

  return res.json({
    success: true,
    isAddressValid,
    isWithinBoundary,
    distanceFromCenter: distFromCenter,
    message: matchMessage
  });
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

    // Inject the Google Maps API key from backend environment
    bObj.mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    // If it's a branch, inherit subscription details from parent and find siblings
    let parentId = business._id;
    if (business.parentBusinessId) {
      const parent = await Business.findById(business.parentBusinessId);
      if (parent) {
        bObj.parentBusiness = parent.toObject();
        bObj.subscriptionStatus = parent.subscriptionStatus;
        bObj.subscriptionExpiry = parent.subscriptionExpiry;
        bObj.isPremium = parent.isPremium;
        parentId = parent._id;
      }
    }

    // Check expiry
    const now = new Date();
    if (bObj.subscriptionExpiry && new Date(bObj.subscriptionExpiry) < now) {
      bObj.subscriptionStatus = 'expired';
    }

    // Get reviews for this business
    const reviews = await Review.find({ businessId: business._id });
    bObj.reviews = reviews;

    // Get approved branches/siblings for this business
    const branches = await Business.find({ parentBusinessId: parentId, status: 'Approved' });
    bObj.branches = branches;
    bObj.branchesCount = branches.length;

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
      highlights,
      phone,
      whatsapp,
      email,
      website,
      instagram,
      facebook,
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
      categoryStatus,
      offers,
      menuUrls,
      isFoodBusiness
    } = req.body;

    // 0. Final validation of required fields
    if (!name || !category || !type || !description || !phone || !whatsapp || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: Please fill in all required business profile details.',
      });
    }

    // 1. Address Geocoding & Boundary validation (must be within 35km of Udumalpet center)
    const geoValidation = await validateAddressAndBoundary(
      `${address || ''} ${locality || ''}`,
      pincode,
      coordinates ? coordinates.lat : req.body.latitude,
      coordinates ? coordinates.lng : req.body.longitude
    );
    if (!geoValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: geoValidation.message,
      });
    }

    // 2. Address verification audit
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
    const isTestUser = 
      (req.user && (
        req.user.email === 'test@gmail.com' || 
        req.user.name === 'xxx' || 
        req.user.fullName === 'xxx' || 
        req.user.phone === '1234567891' || 
        req.user.mobileNumber === '1234567891'
      )) ||
      phone === '1234567891' ||
      email === 'test@gmail.com' ||
      name === 'xxx';

    let business = null;
    if (!isTestUser) {
      const listings = await Business.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
      if (listings.length > 0) {
        business = listings[0];
        if (listings.length > 1) {
          const deleteIds = listings.slice(1).map(b => b._id);
          await Business.deleteMany({ _id: { $in: deleteIds } });
          console.log(`[DUPLICATE CLEANUP ON CREATE] Deleted ${deleteIds.length} duplicate business listings for owner ${req.user._id}`);
        }
      }
    } else {
      console.log(`[TEST USER BYPASS] Allowed duplicate registration for test account: ${req.user?.email || email}`);
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
      highlights: highlights || [],
      phone,
      whatsapp,
      email,
      website: website || '',
      instagram: instagram || '',
      facebook: facebook || '',
      address,
      locality,
      pincode,
      isAddressVerified: finalAddressVerified, // set to match verified status
      logoUrl: logoUrl || '',
      coverImageUrl: coverImageUrl || '',
      galleryUrls: galleryUrls || [],
      menuUrls: menuUrls || [],
      isFoodBusiness: isFoodBusiness !== undefined ? isFoodBusiness : false,
      googlePlaceId: googlePlaceId || '',
      googleRating: googleRating || 0,
      googleReviewsCount: googleReviewsCount || 0,
      googleReviews: googleReviews || [],
      latitude: geoValidation.lat,
      longitude: geoValidation.lng,
      coordinates: { lat: geoValidation.lat, lng: geoValidation.lng },
      timings: timings || {
        Monday: '9:00 AM - 8:00 PM',
        Tuesday: '9:00 AM - 8:00 PM',
        Wednesday: '9:00 AM - 8:00 PM',
        Thursday: '9:00 AM - 8:00 PM',
        Friday: '9:00 AM - 8:00 PM',
        Saturday: '9:00 AM - 8:00 PM',
        Sunday: '9:00 AM - 1:00 PM',
      },
      status: 'Pending Verification',
      subscriptionStatus: business ? (business.subscriptionStatus || 'none') : 'none',
      isPremium: business ? (business.isPremium || false) : false,
      customCategoryName: customCategoryName || undefined,
      categoryStatus: categoryStatus || undefined,
      offers: offers || [],
    };

    // If user is referred, run anti-fraud checks before creating/updating
    try {
      const Referral = require('../models/Referral');
      const referral = await Referral.findOne({ referredUserId: req.user._id, status: 'pending' });
      if (referral) {
        let duplicateGST = false;
        if (gstNumber) {
          const existingGstBiz = await Business.findOne({
            gstNumber: gstNumber.trim(),
            ownerId: { $ne: req.user._id }
          });
          if (existingGstBiz) duplicateGST = true;
        }

        const existingNameBiz = await Business.findOne({
          $or: [
            { name: name },
            { businessName: name }
          ],
          ownerId: { $ne: req.user._id }
        });
        const duplicateBusiness = !!existingNameBiz;

        let duplicateMobile = false;
        if (phone) {
          const existingPhoneBiz = await Business.findOne({
            $or: [{ phone }, { whatsapp: phone }],
            ownerId: { $ne: req.user._id }
          });
          if (existingPhoneBiz) duplicateMobile = true;
        }

        if (duplicateGST) {
          return res.status(400).json({ success: false, message: 'Referral validation failed: This GST number is already registered on UBT.' });
        }
        if (duplicateBusiness) {
          return res.status(400).json({ success: false, message: 'Referral validation failed: This business name is already registered on UBT.' });
        }
        if (duplicateMobile) {
          return res.status(400).json({ success: false, message: 'Referral validation failed: This mobile number is already registered on UBT.' });
        }
      }
    } catch (err) {
      console.error('Error during pre-save referral checks:', err);
    }

    if (business) {
      if (false && business.subscriptionStatus === 'active') {
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

    // Save link to referral
    try {
      const Referral = require('../models/Referral');
      const referral = await Referral.findOne({ referredUserId: req.user._id, status: 'pending' });
      if (referral) {
        referral.referredBusinessId = business._id;
        await referral.save();
      }
    } catch (err) {
      console.error('Error in post-save referral link:', err);
    }

    // Save branches if provided
    if (req.body.branches && Array.isArray(req.body.branches)) {
      try {
        await syncBranches(business, req.body.branches, req.user.role);
        console.log(`[BRANCHES SAVE] Synchronized branches for business ${business._id}`);
      } catch (branchErr) {
        console.error('Error saving branches in business POST route:', branchErr);
      }
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

    // Geocoding and allowed area boundary validation on update
    if (req.body.address || req.body.pincode || req.body.coordinates || req.body.latitude || req.body.longitude) {
      const checkAddress = req.body.address || business.address || '';
      const checkLocality = req.body.locality || business.locality || '';
      const checkPincode = req.body.pincode || business.pincode;
      const checkLat = req.body.coordinates?.lat || req.body.latitude || business.coordinates?.lat || business.latitude;
      const checkLng = req.body.coordinates?.lng || req.body.longitude || business.coordinates?.lng || business.longitude;

      const geoValidation = await validateAddressAndBoundary(
        `${checkAddress} ${checkLocality}`,
        checkPincode,
        checkLat,
        checkLng
      );
      if (!geoValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: geoValidation.message
        });
      }

      req.body.latitude = geoValidation.lat;
      req.body.longitude = geoValidation.lng;
      req.body.coordinates = {
        lat: geoValidation.lat,
        lng: geoValidation.lng
      };
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

    // Save branches if provided
    if (req.body.branches && Array.isArray(req.body.branches)) {
      try {
        await syncBranches(business, req.body.branches, req.user.role);
        console.log(`[BRANCHES UPDATE] Synchronized branches for business ${business._id}`);
      } catch (branchErr) {
        console.error('Error saving branches in business PUT route:', branchErr);
      }
    }

    res.json({ success: true, data: business });
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
    
    // Find existing business for this user (primary listing only)
    let business = await Business.findOne({
      ownerId: req.user._id,
      $or: [{ parentBusinessId: null }, { parentBusinessId: { $exists: false } }]
    });
    
    if (business) {
      // If the business is already paid, don't allow modifying it via draft (bypassed in dev mode)
      if (false && business.subscriptionStatus === 'active') {
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
        status: fields.status || 'Pending Verification',
        subscriptionStatus: fields.subscriptionStatus || 'none',
        isPremium: fields.isPremium !== undefined ? fields.isPremium : false,
      });
      await business.save();
    }

    // Save branches draft if provided
    if (fields.branches && Array.isArray(fields.branches)) {
      try {
        await syncBranches(business, fields.branches, req.user.role);
        console.log(`[BRANCHES DRAFT] Drafted branches for business ${business._id}`);
      } catch (branchErr) {
        console.error('Error saving branches in business draft route:', branchErr);
      }
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

// @desc    Increment click count for a business by action type
// @route   POST /api/businesses/:id/click
// @access  Public
router.post('/:id/click', async (req, res) => {
  const { type } = req.body;
  const validTypes = ['call', 'whatsapp', 'website', 'instagram', 'facebook'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid click type' });
  }

  try {
    const updateField = `${type}Clicks`;
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    res.json({ success: true, clicks: business[updateField] });
  } catch (error) {
    console.error(`Error incrementing ${type} clicks:`, error);
    res.status(505).json({ success: false, message: error.message });
  }
});

module.exports = router;
