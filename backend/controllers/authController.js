const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');
const Blog = require('../models/Blog');
const Event = require('../models/Event');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ubt_jwt_secret_token_123456', {
    expiresIn: '30d',
  });
};

/**
 * Register user
 */
const registerUser = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const { name, fullName, email, phone, mobileNumber, password, role, referralCode } = value;
    const resolvedName = name || fullName;
    const resolvedPhone = phone || mobileNumber;

    // Test email bypass to allow re-registrations
    if (email && email.toLowerCase() === 'harishmitharamalingam@gmail.com') {
      const existingTestUsers = await User.find({
        $or: [
          { email: 'harishmitharamalingam@gmail.com' },
          { phone: resolvedPhone },
          { mobileNumber: resolvedPhone }
        ]
      });

      for (const u of existingTestUsers) {
        await Business.deleteMany({ ownerId: u._id });
        await User.deleteOne({ _id: u._id });
      }
    }

    // Check duplicate
    const userExists = await User.findOne({
      $or: [
        { email },
        { phone: resolvedPhone },
        { mobileNumber: resolvedPhone }
      ]
    });

    if (userExists) {
      const isEmailMatch = userExists.email && email && (userExists.email.toLowerCase() === email.toLowerCase());
      const message = isEmailMatch 
        ? 'Email address is already registered' 
        : 'Mobile number is already registered';
      return sendError(res, 400, message);
    }

    // Look up referrer if referral code provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode: referralCode.trim().toUpperCase() });
      if (!referrer) {
        return sendError(res, 400, 'Invalid referral code');
      }

      // Check self-referral
      if (
        referrer.email.toLowerCase() === email.toLowerCase() ||
        referrer.phone === resolvedPhone ||
        referrer.mobileNumber === resolvedPhone
      ) {
        return sendError(res, 400, 'You cannot refer yourself');
      }
    }

    // Create new user
    const user = await User.create({
      name: resolvedName,
      fullName: resolvedName,
      email,
      phone: resolvedPhone,
      mobileNumber: resolvedPhone,
      password,
      role: role || 'owner', // Defaults to owner onboarding
      referredBy: referrer ? referrer._id : undefined
    });

    // Create pending Referral record
    if (referrer) {
      const Referral = require('../models/Referral');
      await Referral.create({
        referrerId: referrer._id,
        referredUserId: user._id,
        status: 'pending',
        points: 100,
        antiFraudChecks: {
          selfReferral: false,
          duplicateMobile: false,
          duplicateGST: false,
          duplicateBusiness: false
        }
      });
    }

    return sendSuccess(res, 201, 'User registered successfully', {
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login user
 */
const loginUser = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return sendError(res, 400, error.details[0].message);
    }

    const { email, password } = value;
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { phone: email },
        { mobileNumber: email }
      ]
    });

    if (user && (await user.matchPassword(password))) {
      if (user.status === 'Suspended') {
        return sendError(res, 403, 'Your administrative account has been suspended due to system violations.');
      }

      const business = await Business.findOne({ ownerId: user._id });
      
      // A business is only considered an incomplete draft if it lacks essential completed listing fields
      const isDraft = business && (
        (!business.name && !business.businessName) ||
        !business.category ||
        !business.description ||
        !business.phone ||
        !business.pincode
      );
      
      const draftBusiness = (business && isDraft) ? business : null;

      return sendSuccess(res, 200, 'Authenticated successfully', {
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          fullName: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        draftBusiness
      });
    } else {
      return sendError(res, 401, 'Invalid email or password');
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Get current profile
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, 200, 'User profile fetched', req.user);
  } catch (err) {
    next(err);
  }
};

/**
 * Update profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User account not found');
    }

    if (req.body.name || req.body.fullName) {
      const newName = req.body.name || req.body.fullName;
      user.name = newName;
      user.fullName = newName;
    }

    if (req.body.email) {
      const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
      if (emailExists) {
        return sendError(res, 400, 'Email address already in use by another user');
      }
      user.email = req.body.email;
    }

    if (req.body.phone || req.body.mobileNumber) {
      const newPhone = req.body.phone || req.body.mobileNumber;
      user.phone = newPhone;
      user.mobileNumber = newPhone;
    }

    if (req.body.profileImage) {
      user.profileImage = req.body.profileImage;
    }

    // Handle password update securely
    if (req.body.newPassword) {
      if (!req.body.currentPassword) {
        return sendError(res, 400, 'Current password is required to save a new password');
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return sendError(res, 400, 'Current password does not match database record');
      }
      user.password = req.body.newPassword;
    }

    await user.save();

    return sendSuccess(res, 200, 'Profile credentials successfully updated', {
      id: user._id,
      name: user.name,
      fullName: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete account
 */
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Cascade delete associated listings, blogs, and events
    await Business.deleteMany({ ownerId: userId });
    await Blog.deleteMany({ author: userId });
    await Event.deleteMany({ ownerId: userId });
    await User.deleteOne({ _id: userId });

    return sendSuccess(res, 200, 'Your registration and all associated listings, events, and blogs have been permanently deleted.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  deleteAccount
};
