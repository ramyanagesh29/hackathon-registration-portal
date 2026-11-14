
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    // Read JWT from the HTTP-only cookie
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      })
    }

    // Verify the JWT signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find the user associated with this token
    const user = await User.findById(decoded.userId).select('-password -otpHash')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.',
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email.',
      })
    }

    // Attach user information to the request
    req.user = user

    next()
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Your session is invalid or expired. Please log in again.',
      })
    }

    console.error('Authentication error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
    })
  }
}

module.exports = protect
