const Business = require('../models/Business');
const Category = require('../models/Category');
const Review = require('../models/Review');
const { businessSchema } = require('../validations/businessValidation');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * Register a new business listing
 */
const registerBusiness = async (req, res, next) => {
  try {
    const { error, value } = businessSchema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const {
      businessName,
      name,
      category,
      type,
      description,
      phone,
      whatsapp,
      email,
      website,
      instagram,
      facebook,
      address,
      locality,
      city,
      state,
      pincode,
      latitude,
      longitude,
      googlePlaceId,
      googleLinked,
      tags,
      galleryImages,
      openingHours,
      customCategoryName,
      categoryStatus,
      highlights
    } = value;

    const resolvedName = businessName || name;

    // Check if the merchant already owns a business with this name
    const businessExists = await Business.findOne({
      ownerId: req.user._id,
      $or: [{ name: resolvedName }, { businessName: resolvedName }]
    });

    if (businessExists) {
      return sendError(res, 400, 'You have already listed a business under this name.');
    }

    // Attempt to map category to Category database ref
    let categoryId = null;
    const catDoc = await Category.findOne({ categoryName: category });
    if (catDoc) {
      categoryId = catDoc._id;
    }

    // Set coordinates objects
    const resolvedCoordinates = {
      lat: latitude || 10.585,
      lng: longitude || 77.251
    };

    const business = await Business.create({
      ownerId: req.user._id,
      categoryId,
      name: resolvedName,
      businessName: resolvedName,
      category,
      type: type || 'Local Business',
      description,
      phone,
      whatsapp: whatsapp || phone,
      email,
      website,
      instagram,
      facebook,
      address,
      locality,
      city: city || 'Udumalpet',
      state: state || 'Tamil Nadu',
      pincode,
      latitude: latitude || 10.585,
      longitude: longitude || 77.251,
      coordinates: resolvedCoordinates,
      googlePlaceId,
      googleLinked,
      tags: tags || [],
      highlights: highlights || [],
      galleryUrls: galleryImages || [],
      galleryImages: galleryImages || [],
      timings: openingHours || {
        Monday: '9:00 AM - 8:00 PM',
        Tuesday: '9:00 AM - 8:00 PM',
        Wednesday: '9:00 AM - 8:00 PM',
        Thursday: '9:00 AM - 8:00 PM',
        Friday: '9:00 AM - 8:00 PM',
        Saturday: '9:00 AM - 8:00 PM',
        Sunday: '9:00 AM - 1:00 PM',
      },
      openingHours: openingHours,
      status: 'Pending Verification',
      verificationStatus: 'pending',
      subscriptionStatus: 'none',
      isPremium: false,
      featured: false,
      customCategoryName,
      categoryStatus
    });

    return sendSuccess(res, 201, 'Business listed successfully and placed in audit queue', business);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all business listings (with paginations, filters, keyword search)
 */
const getAllBusinesses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const queryObj = {};

    // Filter by category
    if (req.query.category && req.query.category !== 'All Categories') {
      queryObj.category = req.query.category;
    }

    // Filter by locality
    if (req.query.locality && req.query.locality !== 'All Localities') {
      queryObj.locality = req.query.locality;
    }

    // Filter by pincode
    if (req.query.pincode) {
      queryObj.pincode = req.query.pincode;
    }

    // Filter by verified/approved status
    if (req.query.verified === 'true') {
      queryObj.$or = [
        { status: 'Approved' },
        { verificationStatus: 'approved' }
      ];
    } else if (req.query.status) {
      queryObj.status = req.query.status;
    }

    // Filter by premium
    if (req.query.type === 'Premium' || req.query.premium === 'true') {
      queryObj.isPremium = true;
      queryObj.subscriptionStatus = 'active';
    }

    // Keyword text search
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q, 'i');
      queryObj.$or = [
        { name: searchRegex },
        { businessName: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
        { locality: searchRegex },
        { tags: searchRegex }
      ];
    }

    // Count matching
    const total = await Business.countDocuments(queryObj);

    // Dynamic sorting: Premium and active directories are boosted to the top of searches
    const businesses = await Business.find(queryObj)
      .sort({
        isPremium: -1,
        subscriptionStatus: 1, // 'active' prioritised
        googleRating: -1,
        createdAt: -1
      })
      .skip(skip)
      .limit(limit)
      .populate('ownerId', 'name email phone profileImage');

    return sendSuccess(res, 200, 'Businesses retrieved', {
      businesses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get details of a single business
 */
const getBusinessById = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('ownerId', 'name email phone profileImage');

    if (!business) {
      return sendError(res, 404, 'Business listing not found');
    }

    // Fetch local reviews
    const reviews = await Review.find({ businessId: business._id })
      .populate('userId', 'name email profileImage')
      .sort({ createdAt: -1 });

    const businessObj = business.toObject();
    businessObj.mapsApiKey = process.env.GOOGLE_MAPS_API_KEY || '';

    return sendSuccess(res, 200, 'Business details retrieved', {
      business: businessObj,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Sync Google business integration profiles and place validation
 */
const syncGoogleBusiness = async (req, res, next) => {
  try {
    const { googlePlaceId, googleRating, googleReviewsCount, googleReviews } = req.body;
    
    const business = await Business.findById(req.params.id);
    if (!business) {
      return sendError(res, 404, 'Business listing not found');
    }

    // Verify owner rights
    if (business.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return sendError(res, 403, 'You are not authorized to sync Google integration parameters for this listing.');
    }

    business.googlePlaceId = googlePlaceId || business.googlePlaceId;
    business.googleRating = googleRating || business.googleRating;
    business.googleReviewsCount = googleReviewsCount || business.googleReviewsCount;
    business.isAddressVerified = true;
    business.googleLinked = true;
    
    if (googleReviews && googleReviews.length) {
      business.googleReviews = googleReviews;
    }

    await business.save();

    return sendSuccess(res, 200, 'Google business integration parameters successfully synced', business);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerBusiness,
  getAllBusinesses,
  getBusinessById,
  syncGoogleBusiness
};
