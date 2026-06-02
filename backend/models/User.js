const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['visitor', 'merchant', 'owner', 'admin', 'superadmin'],
    default: 'visitor',
  },
  profileImage: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended'],
    default: 'Active',
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  referralPoints: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

// Virtuals/pre-save hooks to sync name/phone for backward compatibility
UserSchema.pre('save', async function () {
  if (this.fullName && !this.name) this.name = this.fullName;
  if (this.name && !this.fullName) this.fullName = this.name;
  if (this.mobileNumber && !this.phone) this.phone = this.mobileNumber;
  if (this.phone && !this.mobileNumber) this.mobileNumber = this.phone;

  if (!this.referralCode) {
    let code;
    let codeExists = true;
    while (codeExists) {
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const tempUser = await this.constructor.findOne({ referralCode: code });
      if (!tempUser) {
        codeExists = false;
      }
    }
    this.referralCode = code;
  }

  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
