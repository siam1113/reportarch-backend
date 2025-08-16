const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const securityMiddleware = [
  helmet(),
  cors(),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Increased from 100 to 500 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    // Skip rate limiting for development
    skip: (req, res) => {
      return process.env.NODE_ENV === 'development';
    }
  }),
];

module.exports = securityMiddleware;
