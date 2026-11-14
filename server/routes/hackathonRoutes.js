
const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  registerHackathon,
  getMyRegistration,
  updateRegistrationLinks,
} = require('../controllers/hackathonController')

// Both endpoints require a valid login.
router.post('/register', protect, registerHackathon)

router.get('/my-entry', protect, getMyRegistration)

router.put('/update-links', protect, updateRegistrationLinks)

module.exports = router
