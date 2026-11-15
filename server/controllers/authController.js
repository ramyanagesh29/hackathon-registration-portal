
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const sendOTPEmail = require('../utils/sendEmail')

// OTP security settings
const OTP_EXPIRY_MINUTES = 10
const MAX_OTP_ATTEMPTS = 5
const OTP_BLOCK_MINUTES = 15
const OTP_RESEND_SECONDS = 60

// Generate a secure six-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString()
}

// Hash OTP before storing it
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

// Normalize email
const normalizeEmail = (email) => {
  return typeof email === 'string' ? email.trim().toLowerCase() : ''
}

// Reset OTP security fields
const resetOTPAttempts = (user) => {
  user.otpAttempts = 0
  user.otpBlockedUntil = null
}

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof confirmPassword !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.',
      })
    }

    const cleanName = name.trim()
    const cleanEmail = normalizeEmail(email)

    if (cleanName.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Name must contain at least 3 characters.',
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.',
      })
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters, uppercase, lowercase and a number.',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      })
    }

    let user = await User.findOne({ email: cleanEmail })
    const isNewUser = !user

    if (user && user.isVerified) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered. Please log in.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const otp = generateOTP()

    if (!user) {
      user = new User({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        isVerified: false,
      })
    } else {
      user.name = cleanName
      user.password = hashedPassword
    }

    user.otpHash = hashOTP(otp)
    user.otpExpires = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )
    user.otpLastSentAt = new Date()

    resetOTPAttempts(user)

    await user.save()

    try {
      await sendOTPEmail(cleanEmail, otp)
    } catch (emailError) {
      if (isNewUser) {
        await User.deleteOne({ _id: user._id })
      } else {
        user.otpHash = null
        user.otpExpires = null
        user.otpLastSentAt = null
        await user.save()
      }

      console.error('OTP email delivery failed:', emailError.message)

      return res.status(500).json({
        success: false,
        message: 'Unable to send verification email. Please try again.',
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Signup successful. OTP sent to your email.',
      email: cleanEmail,
    })
  } catch (error) {
    console.error('Signup error:', error.message)

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already registered.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during signup.',
    })
  }
}

// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body
    const cleanEmail = normalizeEmail(email)

    if (!cleanEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      })
    }

    if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid six-digit OTP.',
      })
    }

    const user = await User.findOne({ email: cleanEmail })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please sign up again.',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This account is already verified.',
      })
    }

    // Check temporary verification block
    if (
      user.otpBlockedUntil &&
      user.otpBlockedUntil.getTime() > Date.now()
    ) {
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP after the cooldown.',
      })
    }

    // Clear an expired block
    if (user.otpBlockedUntil) {
      user.otpBlockedUntil = null
      user.otpAttempts = 0
      await user.save()
    }

    if (
      !user.otpHash ||
      !user.otpExpires ||
      user.otpExpires.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      })
    }

    const storedHash = Buffer.from(user.otpHash, 'hex')
    const submittedHash = Buffer.from(hashOTP(otp), 'hex')

    if (
      storedHash.length !== submittedHash.length ||
      !crypto.timingSafeEqual(storedHash, submittedHash)
    ) {
      user.otpAttempts = (user.otpAttempts || 0) + 1

      if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        user.otpBlockedUntil = new Date(
          Date.now() + OTP_BLOCK_MINUTES * 60 * 1000
        )
      }

      await user.save()

      const remaining = Math.max(
        0,
        MAX_OTP_ATTEMPTS - user.otpAttempts
      )

      return res.status(400).json({
        success: false,
        message:
          remaining === 0
            ? 'Too many incorrect attempts. Verification is blocked for 15 minutes.'
            : `Incorrect OTP. ${remaining} attempts remaining.`,
      })
    }

    // OTP verified successfully
    user.isVerified = true
    user.otpHash = null
    user.otpExpires = null
    user.otpLastSentAt = null

    resetOTPAttempts(user)

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    })
  } catch (error) {
    console.error('OTP verification error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification.',
    })
  }
}

// POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body
    const cleanEmail = normalizeEmail(email)

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    const user = await User.findOne({ email: cleanEmail })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please sign up.',
      })
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Your email is already verified.',
      })
    }

    // Enforce 60-second resend cooldown
    if (user.otpLastSentAt) {
      const elapsedSeconds =
        (Date.now() - user.otpLastSentAt.getTime()) / 1000

      if (elapsedSeconds < OTP_RESEND_SECONDS) {
        const remaining = Math.ceil(
          OTP_RESEND_SECONDS - elapsedSeconds
        )

        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting another OTP.`,
        })
      }
    }

    const otp = generateOTP()

    // Send email before replacing the existing OTP
    await sendOTPEmail(user.email, otp)

    user.otpHash = hashOTP(otp)
    user.otpExpires = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )
    user.otpLastSentAt = new Date()

    resetOTPAttempts(user)

    await user.save()

    return res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email.',
    })
  } catch (error) {
    console.error('Resend OTP error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to resend OTP. Please try again.',
    })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const cleanEmail = normalizeEmail(email)

    if (!cleanEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not configured.')

      return res.status(500).json({
        success: false,
        message: 'Authentication service is not configured.',
      })
    }

    const user = await User.findOne({ email: cleanEmail })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256',
      }
    )

    const isProduction = process.env.NODE_ENV === 'production'

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to log in. Please try again.',
    })
  }
}

// POST /api/auth/logout
const logout = (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production'

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  })

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  })
}

module.exports = {
  signup,
  verifyOTP,
  resendOTP,
  login,
  logout,
}
