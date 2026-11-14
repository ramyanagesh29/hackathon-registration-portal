
const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

router.get('/me', protect, async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
      },
    })
  } catch (error) {
    console.error('Profile fetch error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch user profile.',
    })
  }
})

module.exports = router
