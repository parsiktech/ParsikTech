const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { sendContactFormEmail } = require('../services/emailService');

// Rate limiting for contact form (simple in-memory)
const submissions = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_SUBMISSIONS = 5; // Max 5 per hour per IP

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userSubmissions = submissions.get(ip) || [];

  // Filter out old submissions
  const recentSubmissions = userSubmissions.filter(time => now - time < RATE_LIMIT_WINDOW);

  if (recentSubmissions.length >= MAX_SUBMISSIONS) {
    return false;
  }

  recentSubmissions.push(now);
  submissions.set(ip, recentSubmissions);
  return true;
};

// POST /api/contact - Submit contact form
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  ],
  async (req, res) => {
    try {
      // Check validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Check rate limit
      const clientIp = req.ip || req.connection.remoteAddress;
      if (!checkRateLimit(clientIp)) {
        return res.status(429).json({
          success: false,
          error: 'Too many submissions. Please try again later.'
        });
      }

      const { name, email, subject, message } = req.body;

      // Send the email
      const result = await sendContactFormEmail({ name, email, subject, message });

      if (result.success) {
        res.json({
          success: true,
          message: 'Your message has been sent successfully. We\'ll get back to you soon!'
        });
      } else {
        console.error('Contact form email failed:', result.error);
        res.status(500).json({
          success: false,
          error: 'Failed to send message. Please try again or email us directly.'
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      });
    }
  }
);

module.exports = router;
