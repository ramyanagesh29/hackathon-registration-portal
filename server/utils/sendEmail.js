
const { Resend } = require('resend')

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

const sendOTPEmail = async (email, otp) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key is missing')
  }

  const { data, error } = await resend.emails.send({
    from: 'Code-a-Nova <onboarding@resend.dev>',
    to: [email],
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

  if (error) {
    console.error('Resend OTP email error:', error)
    throw new Error(error.message || 'OTP email delivery failed')
  }

  console.log(`OTP email accepted by Resend for ${email}`)
  return data
}

module.exports = sendOTPEmail
