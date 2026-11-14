
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: {
      name: 'Code-a-Nova',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: 'Your Code-A-Nova Email Verification OTP',
    html: `
      <div style="font-family: Arial; max-width: 550px; margin: auto; padding: 25px; background: #f8f7ff; border-radius: 12px;">
        <h2 style="color: #6035c9;">Welcome to Code-A-Nova!</h2>
        <p>Thank you for creating your account.</p>
        <p>Your email verification OTP is:</p>
        <h1 style="letter-spacing: 8px; color: #6035c9;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <hr />
        <p>Regards,<br/>Code-a-Nova Team</p>
      </div>
    `,
  })

  console.log('OTP email sent successfully')
}

module.exports = sendOTPEmail
