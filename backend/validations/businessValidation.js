const Joi = require('joi');
const { APPROVED_PINCODES, APPROVED_LOCALITIES } = require('../constants/pincodes');

const businessSchema = Joi.object({
  businessName: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Business name cannot be empty',
    'string.min': 'Business name must be at least 3 characters'
  }),
  name: Joi.string().trim().min(3).max(100).optional(), // Backward compatibility
  categoryId: Joi.string().hex().length(24).optional(), // MongoDB ObjectId
  category: Joi.string().trim().required().messages({
    'any.required': 'Category classification is required'
  }),
  type: Joi.string().trim().optional(),
  description: Joi.string().max(1000).required(),
  phone: Joi.string().trim().pattern(/^[0-9+\s-]{10,15}$/).required(),
  whatsapp: Joi.string().trim().pattern(/^[0-9+\s-]{10,15}$/).optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  website: Joi.string().trim().uri().allow('').optional(),
  instagram: Joi.string().trim().allow('').optional(),
  facebook: Joi.string().trim().allow('').optional(),
  address: Joi.string().trim().min(3).allow('').optional(),
  
  // Locality-aware address validation
  locality: Joi.string().trim().lowercase().allow('').optional().custom((value, helpers) => {
    if (!value) return value;
    const matched = APPROVED_LOCALITIES.some(loc => value.includes(loc) || loc.includes(value));
    if (!matched) {
      return helpers.message(`Locality "${value}" is not a recognized Udumalpet local territory. Please select a valid locality within Udumalpet.`);
    }
    return value;
  }),
  
  city: Joi.string().trim().valid('Udumalpet', 'udumalpet', 'UDUMALPET').default('Udumalpet').messages({
    'any.only': 'UBT platform is exclusively focused on local businesses operating within Udumalpet town boundaries.'
  }),
  state: Joi.string().trim().default('Tamil Nadu'),
  
  // Udumalpet Pincode validation
  pincode: Joi.string().trim().required().custom((value, helpers) => {
    if (!APPROVED_PINCODES.includes(value)) {
      return helpers.message(`Pincode "${value}" is outside Udumalpet operational boundaries. Authorized Udumalpet pincodes are: ${APPROVED_PINCODES.join(', ')}.`);
    }
    return value;
  }),
  
  latitude: Joi.number().min(10.0).max(11.0).optional(), // Latitude boundary for Udumalpet
  longitude: Joi.number().min(77.0).max(78.0).optional(), // Longitude boundary for Udumalpet
  googlePlaceId: Joi.string().allow('').optional(),
  googleLinked: Joi.boolean().default(false),
  googleRating: Joi.number().min(0).max(5).optional(),
  googleReviewsCount: Joi.number().integer().min(0).optional(),
  googleReviews: Joi.array().items(Joi.object({
    authorName: Joi.string().allow('').optional(),
    rating: Joi.number().optional(),
    text: Joi.string().allow('').optional(),
    createdAt: Joi.any().optional()
  })).optional(),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  highlights: Joi.array().items(Joi.string().trim()).optional(),
  galleryImages: Joi.array().items(Joi.string().uri()).optional(),
  openingHours: Joi.object().optional(),
  customCategoryName: Joi.string().trim().allow('').optional(),
  requestedParentCategory: Joi.string().trim().allow('').optional(),
  categoryStatus: Joi.string().trim().valid('Normal', 'Pending Review').optional()
});

module.exports = {
  businessSchema
};
