
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured.')

      return res.status(500).json({
        success: false,
        message: 'Authentication service is not configured.',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    )

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.',
      })
    }

    const user = await User.findById(decoded.userId)
      .select('-password -otpHash')

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

    req.user = user

    next()

  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
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
