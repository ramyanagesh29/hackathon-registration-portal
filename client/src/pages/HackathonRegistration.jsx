
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
  ArrowLeft,
  Users,
  User,
  Mail,
  Phone,
  GraduationCap,
  Code,
  Link as LinkIcon,
  Plus,
  Send,
  LoaderCircle,
  Trophy,
} from 'lucide-react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Predefined college options.
// Add or change options according to the colleges accepted by your event.
const colleges = [
  'Vidya Vikas Institute of Engineering and Technology',
  'Maharaja Institute of Technology Mysore',
  'JSS Science and Technology University',
  'National Institute of Engineering',
  'Sri Jayachamarajendra College of Engineering',
  'Other',
]

const courses = [
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

const branches = [
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

const years = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
]

const domains = [
  'AI/ML',
  'Web Development',
  'IoT',
  'Cyber Security',
  'Blockchain',
  'Data Science',
  'Cloud Computing',
  'Other',
]

const emptyForm = {
  fullName: '',
  email: '',
  mobile: '',
  college: '',
  course: '',
  branch: '',
  year: '',
  domain: '',
  projectName: '',
  pptLink: '',
  prototypeLink: '',
  demoVideoLink: '',
  teamSize: '1',
  teamMembers: [],
}

function HackathonRegistration() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(emptyForm)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailWarning, setEmailWarning] = useState('')

  // Load the authenticated user's profile.
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/me`,
          { withCredentials: true }
        )

        const user = response.data.user

        setFormData((previous) => ({
          ...previous,
          fullName: user.name || '',
          email: user.email || '',
        }))
      } catch (err) {
        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          navigate('/login', { replace: true })
          return
        }

        setError('Unable to load your account details.')
      } finally {
        setLoadingProfile(false)
      }
    }

    loadProfile()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  // Team size 1 = solo, so no additional member fields.
  // Team size 2–5 = that many additional member entries,
  // following the assignment's dynamic-field example.
  const handleTeamSizeChange = (e) => {
    const size = Number(e.target.value)
    const memberCount = size === 1 ? 0 : size

    setFormData((previous) => ({
      ...previous,
      teamSize: String(size),
      teamMembers: Array.from(
        { length: memberCount },
        (_, index) => previous.teamMembers[index] || {
          name: '',
          email: '',
        }
      ),
    }))

    setError('')
  }

  const handleMemberChange = (index, field, value) => {
    setFormData((previous) => {
      const updatedMembers = [...previous.teamMembers]

      updatedMembers[index] = {
        ...updatedMembers[index],
        [field]: value,
      }

      return {
        ...previous,
        teamMembers: updatedMembers,
      }
    })

    setError('')
  }

  const isValidUrl = (value) => {
    try {
      const url = new URL(value)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  }

  const validateForm = () => {
    const name = formData.fullName.trim()

    if (!/^[A-Za-z ]{3,}$/.test(name)) {
      return 'Full name must contain at least 3 letters and spaces only.'
    }

    if (!formData.email) {
      return 'Your account email could not be loaded.'
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      return 'Enter a valid 10-digit Indian mobile number.'
    }

    if (!formData.college) return 'Please select your college.'
    if (!formData.course) return 'Please select your course.'
    if (!formData.branch) return 'Please select your branch.'
    if (!formData.year) return 'Please select your year of study.'
    if (!formData.domain) return 'Please select a project domain.'

    if (formData.projectName.trim().length < 5) {
      return 'Project name must contain at least 5 characters.'
    }

    if (!isValidUrl(formData.pptLink.trim())) {
      return 'Enter a valid PPT link beginning with http:// or https://.'
    }

    if (!isValidUrl(formData.prototypeLink.trim())) {
      return 'Enter a valid prototype link beginning with http:// or https://.'
    }

    if (
      formData.demoVideoLink.trim() &&
      !isValidUrl(formData.demoVideoLink.trim())
    ) {
      return 'Enter a valid demo video URL.'
    }

    for (let index = 0; index < formData.teamMembers.length; index++) {
      const member = formData.teamMembers[index]
      const memberName = member.name.trim()
      const memberEmail = member.email.trim()

      if (!/^[A-Za-z ]{3,}$/.test(memberName)) {
        return `Enter a valid name for team member ${index + 1}.`
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberEmail)) {
        return `Enter a valid email for team member ${index + 1}.`
      }
    }

    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setEmailWarning('')

    const validationError = validateForm()

    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        ...formData,
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        projectName: formData.projectName.trim(),
        pptLink: formData.pptLink.trim(),
        prototypeLink: formData.prototypeLink.trim(),
        demoVideoLink: formData.demoVideoLink.trim(),
        teamSize: Number(formData.teamSize),
        teamMembers: formData.teamMembers.map((member) => ({
          name: member.name.trim(),
          email: member.email.trim().toLowerCase(),
        })),
      }

      const response = await axios.post(
        `${API_URL}/api/hackathon/register`,
        payload,
        { withCredentials: true }
      )

      if (response.data.success) {
        if (response.data.emailSent) {
          setSuccess(
            'Your registration has been submitted and the confirmation email was sent successfully.'
          )
        } else {
          setSuccess(
            'Your registration has been saved, but the confirmation email could not be sent. Please contact the team.'
          )
          setEmailWarning('Confirmation email delivery is pending.')
        }

        // Navigate after displaying the submission result.
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 2500)
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError(
          err.response?.data?.message ||
          'You have already registered.'
        )
      } else {
        setError(
          err.response?.data?.message ||
          'Registration failed. Please try again.'
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'

  const labelClass =
    'mb-2 block text-sm font-medium text-gray-300'

  const selectClass =
    'w-full rounded-xl border border-white/10 bg-[#0b1020] px-4 py-3 text-white outline-none focus:border-purple-500'

  const SectionTitle = ({ icon: Icon, title, description }) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
        <Icon size={21} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
    </div>
  )

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] text-white">
        Loading your account...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080b18] px-4 py-8 text-white sm:py-12">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">
            <Trophy size={16} />
            Code-a-Nova Hackathon
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Hackathon Registration
          </h1>

          <p className="mt-3 text-gray-400">
            Complete the form below to submit your participation details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">

          {/* Participant details */}
          <section className="rounded-2xl border border-white/10 bg-[#10152a] p-5 sm:p-8">

            <SectionTitle
              icon={User}
              title="Participant Details"
              description="Your personal and academic information."
            />

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className={`${inputClass} cursor-not-allowed opacity-70`}
                />
                <p className="mt-2 text-xs text-gray-500">
                  This is taken from your verified account.
                </p>
              </div>

              <div>
                <label className={labelClass}>Mobile Number *</label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setFormData((previous) => ({
                        ...previous,
                        mobile: value,
                      }))
                    }}
                    className={`${inputClass} pl-10`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>College Name *</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select your college</option>
                  {colleges.map((college) => (
                    <option key={college} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Branch *</label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Year of Study *</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </section>

          {/* Project details */}
          <section className="rounded-2xl border border-white/10 bg-[#10152a] p-5 sm:p-8">

            <SectionTitle
              icon={Code}
              title="Project Details"
              description="Tell us about your hackathon project."
            />

            <div className="space-y-5">

              <div>
                <label className={labelClass}>Domain / Track *</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="">Select project domain</option>
                  {domains.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Project Name *</label>
                <input
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter your project name"
                  minLength={5}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>PPT Link *</label>
                <input
                  type="url"
                  name="pptLink"
                  value={formData.pptLink}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Prototype Link *</label>
                <input
                  type="url"
                  name="prototypeLink"
                  value={formData.prototypeLink}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="GitHub, Figma or live demo URL"
                  required
                />
              </div>

              <div>
                <label className={labelClass}>
                  Demo Video Link
                  <span className="ml-2 text-xs text-gray-500">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="demoVideoLink"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="YouTube or Google Drive URL"
                />
              </div>

            </div>
          </section>

          {/* Team details */}
          <section className="rounded-2xl border border-white/10 bg-[#10152a] p-5 sm:p-8">

            <SectionTitle
              icon={Users}
              title="Team Details"
              description="Choose your team size and enter member information."
            />

            <div className="mb-6 max-w-xs">
              <label className={labelClass}>Team Size *</label>
              <select
                name="teamSize"
                value={formData.teamSize}
                onChange={handleTeamSizeChange}
                className={selectClass}
              >
                {[1, 2, 3, 4, 5].map((size) => (
                  <option key={size} value={size}>
                    {size} {size === 1 ? 'Participant' : 'Participants'}
                  </option>
                ))}
              </select>
            </div>

            {formData.teamSize === '1' ? (
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-purple-200">
                You selected solo participation. No additional team member details are required.
              </div>
            ) : (
              <div className="space-y-5">

                <p className="text-sm text-gray-400">
                  Enter the details of {formData.teamMembers.length} additional team members.
                </p>

                {formData.teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-white/10 bg-[#0b1020] p-4 sm:p-5"
                  >
                    <h3 className="mb-4 font-semibold text-purple-300">
                      Team Member {index + 1}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div>
                        <label className={labelClass}>Member Name *</label>
                        <input
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, 'name', e.target.value)
                          }
                          className={inputClass}
                          placeholder="Enter member name"
                          required
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Member Email *</label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) =>
                            handleMemberChange(index, 'email', e.target.value)
                          }
                          className={inputClass}
                          placeholder="Enter member email"
                          required
                        />
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </section>

          {/* Form messages */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
              {success}
              {emailWarning && (
                <p className="mt-2 text-yellow-300">{emailWarning}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || Boolean(success)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Submitting Registration...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Registration
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500">
            Please review your details before submitting. Duplicate registrations are not allowed.
          </p>

        </form>

      </div>
    </div>
  )
}

export default HackathonRegistration
