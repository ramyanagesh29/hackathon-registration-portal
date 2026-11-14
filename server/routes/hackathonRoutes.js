
const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  registerHackathon,
  getMyRegistration,
} = require('../controllers/hackathonController')

// Both endpoints require a valid login.
router.post('/register', protect, registerHackathon)

router.get('/my-entry', protect, getMyRegistration)

module.exports = router
