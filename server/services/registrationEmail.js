
const escapeHtml = (value = '') =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }

    return entities[character]
  })

const sendRegistrationEmail = async (registration) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('Brevo API key is missing')
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error('Brevo sender email is missing')
  }

  const teamMembers = Array.isArray(registration.teamMembers)
    ? registration.teamMembers
    : []

  const memberRows = teamMembers.length
    ? teamMembers.map((member, index) => `
        <tr>
          <td style="padding:10px;border:1px solid #ddd;">
            ${index + 1}
          </td>
          <td style="padding:10px;border:1px solid #ddd;">
            ${escapeHtml(member.name)}
          </td>
          <td style="padding:10px;border:1px solid #ddd;">
            ${escapeHtml(member.email)}
          </td>
        </tr>
      `).join('')
    : `
        <tr>
          <td colspan="3" style="padding:10px;border:1px solid #ddd;">
            Solo participation
          </td>
        </tr>
      `

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
        to: [{ email: registration.email }],
        subject: 'Hackathon Registration Confirmation - Code-a-Nova',
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:25px;color:#222;">

            <div style="background:#20134a;padding:25px;border-radius:12px;color:white;text-align:center;">
              <h1>Code-a-Nova</h1>
              <p>Hackathon Registration Confirmation</p>
            </div>

            <h2>Hello ${escapeHtml(registration.fullName)},</h2>

            <p>Your hackathon registration has been successfully submitted. Thank you for participating!</p>

            <h3>Participant Details</h3>
            <p><strong>Name:</strong> ${escapeHtml(registration.fullName)}</p>
            <p><strong>Email:</strong> ${escapeHtml(registration.email)}</p>
            <p><strong>Mobile:</strong> ${escapeHtml(registration.mobile)}</p>
            <p><strong>College:</strong> ${escapeHtml(registration.college)}</p>

            <h3>Project Details</h3>
            <p><strong>Project:</strong> ${escapeHtml(registration.projectName)}</p>
            <p><strong>Domain:</strong> ${escapeHtml(registration.domain)}</p>
            <p><strong>Course:</strong> ${escapeHtml(registration.course)}</p>
            <p><strong>Branch:</strong> ${escapeHtml(registration.branch)}</p>
            <p><strong>Year:</strong> ${escapeHtml(registration.year)}</p>
            <p><strong>Team Size:</strong> ${escapeHtml(registration.teamSize)}</p>

            <h3>Team Members</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#eee;">
                  <th style="padding:10px;border:1px solid #ddd;">No.</th>
                  <th style="padding:10px;border:1px solid #ddd;">Name</th>
                  <th style="padding:10px;border:1px solid #ddd;">Email</th>
                </tr>
              </thead>
              <tbody>
                ${memberRows}
              </tbody>
            </table>

            <p style="margin-top:25px;">
              <strong>Registration Status:</strong> Submitted
            </p>

            <hr />

            <p>Regards,<br/><strong>Code-a-Nova Team</strong></p>
          </div>
        `,
      }),
    }
  )

  const result = await response.json()

  if (!response.ok) {
    console.error('Brevo registration email error:', result)
    throw new Error(
      result.message || 'Registration email delivery failed'
    )
  }

  console.log(
    `Registration email accepted by Brevo for ${registration.email}`
  )

  return result
}

module.exports = sendRegistrationEmail
