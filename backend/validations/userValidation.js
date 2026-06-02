const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters'
  }),
  fullName: Joi.string().trim().min(2).max(50).optional().messages({
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 2 characters'
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().trim().pattern(/^[0-9+\s-]{10,15}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number (10-15 digits)'
  }),
  mobileNumber: Joi.string().trim().pattern(/^[0-9+\s-]{10,15}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid mobile number (10-15 digits)'
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('visitor', 'merchant', 'owner', 'admin', 'superadmin').default('owner'),
  referralCode: Joi.string().trim().optional()
}).or('name', 'fullName').or('phone', 'mobileNumber');

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().required().messages({
    'any.required': 'Email or mobile number is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema
};
