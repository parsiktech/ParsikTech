const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later' }
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 login attempts per windowMs
  message: { success: false, message: 'Too many login attempts, please try again later' }
});
app.use('/api/auth/admin/login', authLimiter);
app.use('/api/auth/client/login', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const inviteRoutes = require('./routes/invite');
const contactRoutes = require('./routes/contact');
const adminCompaniesRoutes = require('./routes/admin/companies');
const adminClientsRoutes = require('./routes/admin/clients');
const adminUpdatesRoutes = require('./routes/admin/updates');
const adminDocumentsRoutes = require('./routes/admin/documents');
const adminActivityRoutes = require('./routes/admin/activity');
const clientRoutes = require('./routes/client');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/invite', inviteRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/companies', adminCompaniesRoutes);
app.use('/api/admin/clients', adminClientsRoutes);
app.use('/api/admin/updates', adminUpdatesRoutes);
app.use('/api/admin/documents', adminDocumentsRoutes);
app.use('/api/admin/activity', adminActivityRoutes);
app.use('/api/client', clientRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve uploaded files (for admin preview - clients use download endpoint)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 50MB'
    });
  }

  if (err.message === 'File type not allowed') {
    return res.status(400).json({
      success: false,
      message: 'File type not allowed'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
