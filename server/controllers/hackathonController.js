
const HackathonRegistration = require('../models/HackathonRegistration')
const sendRegistrationEmail = require('../services/registrationEmail')

const allowedCourses = [
  'B.Tech',
  'M.Tech',
  'BCA',
  'MCA',
  'B.Sc.',
  'M.Sc.',
  'BE',
  'ME',
  'Other',
]

const allowedBranches = [
  'CSE',
  'IT',
  'ECE',
  'EEE',
  'ME',
  'CE',
  'ISE',
  'AIML',
  'Other',
]

const allowedYears = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
]

const allowedDomains = [
  'AI/ML',
  'Web Development',
  'IoT',
  'Cyber Security',
  'Blockchain',
  'Data Science',
  'Cloud Computing',
  'Other',
]

const isValidUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// POST /api/hackathon/register
const registerHackathon = async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      college,
      course,
      branch,
      year,
      domain,
      projectName,
      pptLink,
      prototypeLink,
      demoVideoLink,
      teamSize,
      teamMembers,
    } = req.body

    // Basic required-field validation
    const requiredFields = {
      fullName,
      mobile,
      college,
      course,
      branch,
      year,
      domain,
      projectName,
      pptLink,
      prototypeLink,
      teamSize,
    }

    for (const [field, value] of Object.entries(requiredFields)) {
      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ''
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`,
        })
      }
    }

    const cleanedName = fullName.trim()
    const cleanedProject = projectName.trim()
    const cleanedCollege = college.trim()

    if (!/^[A-Za-z ]{3,}$/.test(cleanedName)) {
      return res.status(400).json({
        success: false,
        message: 'Full name must contain at least 3 letters and spaces only.',
      })
    }

    if (!/^[6-9]\d{9}$/.test(String(mobile))) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number.',
      })
    }

    if (!cleanedCollege) {
      return res.status(400).json({
        success: false,
        message: 'College name is required.',
      })
    }

    if (!allowedCourses.includes(course)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid course.',
      })
    }

    if (!allowedBranches.includes(branch)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid branch.',
      })
    }

    if (!allowedYears.includes(year)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid year of study.',
      })
    }

    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Select a valid domain.',
      })
    }

    if (cleanedProject.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Project name must contain at least 5 characters.',
      })
    }

    if (!isValidUrl(pptLink) || !isValidUrl(prototypeLink)) {
      return res.status(400).json({
        success: false,
        message: 'Enter valid PPT and prototype URLs.',
      })
    }

    if (demoVideoLink && !isValidUrl(demoVideoLink)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid demo video URL.',
      })
    }

    const size = Number(teamSize)

    if (!Number.isInteger(size) || size < 1 || size > 5) {
      return res.status(400).json({
        success: false,
        message: 'Team size must be between 1 and 5.',
      })
    }

    // Assignment rule: solo participation has no extra fields.
    // For team size 2–5, render that many additional member entries.
    const expectedMembers = size === 1 ? 0 : size

    if (!Array.isArray(teamMembers) ||
        teamMembers.length !== expectedMembers) {
      return res.status(400).json({
        success: false,
        message: `Please provide ${expectedMembers} additional team member entries for the selected team size.`,
      })
    }

    const cleanedMembers = []

    for (const member of teamMembers) {
      const memberName = String(member.name || '').trim()
      const memberEmail = String(member.email || '').trim().toLowerCase()

      if (!/^[A-Za-z ]{3,}$/.test(memberName)) {
        return res.status(400).json({
          success: false,
          message: 'Each team member name must contain at least 3 letters and spaces only.',
        })
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Enter a valid email for every team member.',
        })
      }

      cleanedMembers.push({
        name: memberName,
        email: memberEmail,
      })
    }

    // The authenticated user is the source of identity.
    // Never trust an email or user ID sent by the frontend.
    const existingRegistration = await HackathonRegistration.findOne({
      user: req.user._id,
    })

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this hackathon.',
      })
    }

    const registration = await HackathonRegistration.create({
      user: req.user._id,
      fullName: cleanedName,
      email: req.user.email,
      mobile: String(mobile),
      college: cleanedCollege,
      course,
      branch,
      year,
      domain,
      projectName: cleanedProject,
      pptLink,
      prototypeLink,
      demoVideoLink: demoVideoLink || '',
      teamSize: size,
      teamMembers: cleanedMembers,
    })

    // Email delivery is attempted after the database save.
    // A mail failure must not falsely report that registration failed.
    let emailSent = true

    try {
      await sendRegistrationEmail(registration)
    } catch (emailError) {
      emailSent = false
      console.error(
        'Registration saved, but confirmation email failed:',
        emailError.message
      )
    }

    return res.status(201).json({
      success: true,
      message: 'Hackathon registration submitted successfully.',
      emailSent,
      registration,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for this hackathon.',
      })
    }

    console.error('Hackathon registration error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to submit registration. Please try again.',
    })
  }
}

// GET /api/hackathon/my-entry
const getMyRegistration = async (req, res) => {
  try {
    const registration = await HackathonRegistration.findOne({
      user: req.user._id,
    }).lean()

    return res.status(200).json({
      success: true,
      registered: Boolean(registration),
      registration: registration || null,
    })
  } catch (error) {
    console.error('Fetch registration error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch registration details.',
    })
  }
}

module.exports = {
  registerHackathon,
  getMyRegistration,
}
