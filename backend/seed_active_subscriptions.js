const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Business = require('./models/Business');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/udtbusiness';

async function seedActiveSubscriptions() {
  console.log('Connecting to database:', mongoUri);
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Find a user to act as the owner (merchant or superadmin)
    let owner = await User.findOne({ role: 'merchant' });
    if (!owner) {
      owner = await User.findOne({ role: 'superadmin' });
    }
    if (!owner) {
      owner = await User.findOne();
    }
    if (!owner) {
      console.log('No user found in the database. Please register a user first.');
      process.exit(1);
    }

    console.log(`Using owner: ${owner.fullName} (${owner.email}) [ID: ${owner._id}]`);

    // 2. Set all existing approved businesses to have 'active' subscriptions
    const updateResult = await Business.updateMany(
      { status: 'Approved' },
      { $set: { subscriptionStatus: 'active', subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } }
    );
    console.log(`Updated ${updateResult.modifiedCount} existing approved businesses to active subscriptions.`);

    // 3. Add new dummy featured businesses with active subscriptions if they don't exist
    const dummyBusinesses = [
      {
        ownerId: owner._id,
        name: 'Sri Murugan Stores',
        businessName: 'Sri Murugan Stores',
        category: 'Departmental Stores',
        locality: 'Gandhi Nagar',
        city: 'Udumalpet',
        state: 'Tamil Nadu',
        googleRating: 4.6,
        googleReviewsCount: 128,
        isPremium: true,
        isAddressVerified: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
        phone: '+91 94430 12345',
        whatsapp: '+91 94430 12345',
        highlights: ['Quality Products', 'Good Service', 'Fair Prices'],
        status: 'Approved',
        verificationStatus: 'approved',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        ownerId: owner._id,
        name: 'Green Valley Hotel',
        businessName: 'Green Valley Hotel',
        category: 'Food & Restaurants',
        locality: 'Pollachi Road',
        city: 'Udumalpet',
        state: 'Tamil Nadu',
        googleRating: 4.8,
        googleReviewsCount: 98,
        isPremium: true,
        isAddressVerified: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
        phone: '+91 98945 99999',
        whatsapp: '+91 98945 99999',
        highlights: ['Pure Veg', 'Family Restaurant', 'AC Rooms'],
        status: 'Approved',
        verificationStatus: 'approved',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        ownerId: owner._id,
        name: 'R.K. Electricals',
        businessName: 'R.K. Electricals',
        category: 'Home Services',
        locality: 'Pollachi Road',
        city: 'Udumalpet',
        state: 'Tamil Nadu',
        googleRating: 4.7,
        googleReviewsCount: 84,
        isPremium: true,
        isAddressVerified: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80',
        phone: '+91 98945 43100',
        whatsapp: '+91 98945 43100',
        highlights: ['On-time Service', 'Expert Technicians', 'Quality Materials'],
        status: 'Approved',
        verificationStatus: 'approved',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      {
        ownerId: owner._id,
        name: 'City Hospital',
        businessName: 'City Hospital',
        category: 'Health & Medical',
        locality: 'Udumalpet',
        city: 'Udumalpet',
        state: 'Tamil Nadu',
        googleRating: 4.5,
        googleReviewsCount: 206,
        isPremium: true,
        isAddressVerified: true,
        coverImageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=500&q=80',
        phone: '+91 4252 223456',
        whatsapp: '+91 98425 22345',
        highlights: ['24x7 Service', 'Experienced Doctors', 'Pharmacy'],
        status: 'Approved',
        verificationStatus: 'approved',
        subscriptionStatus: 'active',
        subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      }
    ];

    for (const biz of dummyBusinesses) {
      const exists = await Business.findOne({ name: biz.name });
      if (!exists) {
        await Business.create(biz);
        console.log(`Created new active subscription business: ${biz.name}`);
      } else {
        await Business.updateOne(
          { _id: exists._id },
          { $set: { subscriptionStatus: 'active', subscriptionExpiry: biz.subscriptionExpiry, status: 'Approved', verificationStatus: 'approved' } }
        );
        console.log(`Updated existing business to active subscription: ${biz.name}`);
      }
    }

    console.log('✓ Seeding complete.');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seedActiveSubscriptions();
