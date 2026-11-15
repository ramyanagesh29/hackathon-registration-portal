
const express = require('express')
const router = express.Router()

const authLimiter = require('../middleware/rateLimiter')

const {
  signup,
  verifyOTP,
  resendOTP,
  login,
  logout,
} = require('../controllers/authController')

// Signup and OTP protection
router.post('/signup', authLimiter, signup)
router.post('/verify-otp', authLimiter, verifyOTP)
router.post('/resend-otp', authLimiter, resendOTP)

// Login protection
router.post('/login', authLimiter, login)

// Logout
router.post('/logout', logout)

module.exports = router
