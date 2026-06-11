const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*', // Allows broad connection while in development, can be configured specifically in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting to prevent brute-force and spamming
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Logging HTTP Requests
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const path = require('path');

// Static uploads folder fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Mappings
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/businesses', require('./routes/businesses'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/events', require('./routes/events'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/superadmin', require('./routes/superadmin'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/referrals', require('./routes/referrals'));
app.use('/api/support', require('./routes/support'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/queries', require('./routes/queries'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/menu', require('./routes/menu'));

// Root & Health Status Check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Udumalpet Business Tour (UBT) Platform APIs are fully operational.'
  });
});

// Centralized Exception & Validation Error Handler
app.use(errorHandler);

module.exports = app;
