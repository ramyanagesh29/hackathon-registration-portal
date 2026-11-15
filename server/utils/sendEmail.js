
const sendOTPEmail = async (email, otp) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('Brevo API key is missing')
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error('Brevo sender email is missing')
  }

  const response = await fetch(
    'https://api.brevo.com/v3/smtp/email',
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Code-a-Nova',
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: 'Your Code-A-Nova Email Verification OTP',
        htmlContent: `
          <div style="font-family:Arial;max-width:550px;margin:auto;padding:25px;background:#f8f7ff;border-radius:12px;">
            <h2 style="color:#6035c9;">Welcome to Code-a-Nova!</h2>
            <p>Thank you for creating your account.</p>
            <p>Your email verification OTP is:</p>
            <h1 style="letter-spacing:8px;color:#6035c9;">${otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <hr />
            <p>Regards,<br/>Code-a-Nova Team</p>
          </div>
        `,
      }),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    console.error('Brevo OTP email error:', result)
    throw new Error(
      result.message || 'OTP email delivery failed'
    )
  }

  console.log(`OTP email accepted by Brevo for ${email}`)
  return result
}

module.exports = sendOTPEmail
