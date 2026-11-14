
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const sendOTPEmail = require('../utils/sendEmail')

// Generate a secure six-digit OTP
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString()
}

// Hash OTP before storing it
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

// POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all fields.',
      })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

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

    if (password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)) {
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
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await user.save()

    try {
      await sendOTPEmail(cleanEmail, otp)
    } catch (emailError) {
      // Remove a newly created account if the OTP email fails.
    if (isNewUser) {
       await User.deleteOne({ _id: user._id })
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

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required.',
      })
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid six-digit OTP.',
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    })

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

    if (!user.otpHash || !user.otpExpires ||
        user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      })
    }

    const submittedHash = hashOTP(otp)

    const otpMatches = crypto.timingSafeEqual(
      Buffer.from(user.otpHash, 'hex'),
      Buffer.from(submittedHash, 'hex')
    )

    if (!otpMatches) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect OTP. Please try again.',
      })
    }

    user.isVerified = true
    user.otpHash = null
    user.otpExpires = null

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
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

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

    const otp = crypto.randomInt(100000, 1000000).toString()

    user.otpHash = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex')

    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    await user.save()

    await sendOTPEmail(user.email, otp)

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


const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      })
    }

    // Find the user by email
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      })
    }

    // Only verified users can log in
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in.',
      })
    }

    // Compare entered password with hashed password
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

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Store JWT in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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
