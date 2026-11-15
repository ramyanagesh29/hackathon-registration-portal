
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,

  standardHeaders: 'draft-7',
  legacyHeaders: false,

  statusCode: 429,

  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. Please try again after 15 minutes.',
    })
  },
})

module.exports = authLimiter
