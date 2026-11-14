
require('dotenv').config()

const sendOTPEmail = require('./utils/sendEmail')

const testEmail = async () => {
  try {
    await sendOTPEmail(process.env.EMAIL_USER, '123456')
    console.log('Test email delivered to the configured recipient.')
  } catch (error) {
    console.error('Email test failed:', error.message)
  }
}

testEmail()
