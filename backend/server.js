const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');
const { startSubscriptionCron } = require('./cron/subscriptionCron');
const { seedDefaultPlans } = require('./routes/plans');

// Routes Mounts
app.use('/api/auth', require('./routes/auth'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/events', require('./routes/events'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/newsletter', require('./routes/newsletter'));

// Load environment variables
dotenv.config();

// Seeder routine for UBT administrative credentials
const seedAdministrativeCredentials = async () => {
  try {
    const User = require('./models/User');
    
    // 1. Seed Super Admin: superadmin@gmail.com / 123456
    const superadminExists = await User.findOne({ email: 'superadmin@gmail.com' });
    if (!superadminExists) {
      await User.create({
        name: 'UBT Super Administrator',
        fullName: 'UBT Super Administrator',
        email: 'superadmin@gmail.com',
        phone: '+91 99999 99999',
        mobileNumber: '+91 99999 99999',
        password: '123456', // Automatically hashes pre-save
        role: 'superadmin',
        isVerified: true,
        status: 'Active'
      });
      console.log('--- Seed SUCCESS: Superadmin console enabled (superadmin@gmail.com / 123456) ---');
    }

    // 2. Seed Standard Admin: admin@gmail.com / 123456
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    if (!adminExists) {
      await User.create({
        name: 'UBT Administrator',
        fullName: 'UBT Administrator',
        email: 'admin@gmail.com',
        phone: '+91 88888 88888',
        mobileNumber: '+91 88888 88888',
        password: '123456', // Automatically hashes pre-save
        role: 'admin',
        isVerified: true,
        status: 'Active'
      });
      console.log('--- Seed SUCCESS: Admin console enabled (admin@gmail.com / 123456) ---');
    }
  } catch (error) {
    console.error('Error during administrative seeder routine execution:', error.message);
  }
};

// Connect to Database and initiate routines sequentially
const initializeServer = async () => {
  try {
    // 1. Connect MongoDB
    await connectDB();

    // 2. Seed Administrative Users
    await seedAdministrativeCredentials();

    // 3. Seed Subscription Plans (₹69/₹690)
    await seedDefaultPlans();

    // 4. Initialize Background Expiry Sweep Cron Tasks
    startSubscriptionCron();

    console.log('UBT Backend Subsystems initialized and synced successfully.');
  } catch (error) {
    console.error('API bootloader initialization sequence failed:', error.message);
  }
};

initializeServer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Boot] UBT Express Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});
