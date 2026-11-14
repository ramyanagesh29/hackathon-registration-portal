
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  LogOut,
  User,
  Mail,
  Trophy,
  ShieldCheck,
  CalendarDays,
  ArrowRight,
  LoaderCircle,
  Users,
} from 'lucide-react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileResponse, registrationResponse] =
          await Promise.all([
            axios.get(`${API_URL}/api/user/me`, {
              withCredentials: true,
            }),
            axios.get(`${API_URL}/api/hackathon/my-entry`, {
              withCredentials: true,
            }),
          ])

        setUser(profileResponse.data.user)

        setRegistration(
          registrationResponse.data.registration
        )
      } catch (err) {
        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {
          navigate('/login', { replace: true })
          return
        }

        setError(
          err.response?.data?.message ||
          'Unable to load dashboard information.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [navigate])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)

      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      )

      navigate('/login', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to log out. Please try again.'
      )
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] text-white">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto mb-3 animate-spin text-purple-400"
            size={32}
          />
          Loading your dashboard...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 text-white">
        <div className="text-center">
          <p>{error || 'Unable to load your profile.'}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Not available'

  const registrationDate = registration?.createdAt
    ? new Date(registration.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="min-h-screen bg-[#080b18] text-white">

      <nav className="sticky top-0 z-10 border-b border-white/10 bg-[#080b18]/95 px-5 py-4 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            <span className="text-purple-400">Code</span>-a-Nova
          </Link>
          <Link
            to="/edit-registration-links"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Edit Registration Links
          </Link>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2 rounded-xl border b order-white/10 px-4 py-2 text-sm text-gray-300 hover:border-red-400 hover:text-red-400 disabled:opacity-50"
          >
            <LogOut size={17} />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">

        <section className="mb-10">
          <p className="text-sm font-semibold tracking-widest text-purple-400">
            PERSONAL DASHBOARD
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome, {user.name}!
          </h1>

          <p className="mt-3 text-gray-400">
            Manage your profile and hackathon participation.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-[#10152a] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <User size={22} />
            </div>
            <p className="text-sm text-gray-400">Account</p>
            <h2 className="mt-1 text-xl font-semibold">Active</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#10152a] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-600/20 text-green-400">
              <ShieldCheck size={22} />
            </div>
            <p className="text-sm text-gray-400">Email Verification</p>
            <h2 className="mt-1 text-xl font-semibold text-green-400">
              {user.isVerified ? 'Verified' : 'Not verified'}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#10152a] p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <CalendarDays size={22} />
            </div>
            <p className="text-sm text-gray-400">Member Since</p>
            <h2 className="mt-1 text-lg font-semibold">{joinedDate}</h2>
          </div>

        </section>

        <section className="mb-8 rounded-2xl border border-white/10 bg-[#10152a] p-6 sm:p-8">

          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Your Profile</h2>
              <p className="text-sm text-gray-400">
                Your registered account information
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm text-gray-400">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Email Address</p>
              <div className="flex items-center gap-2 break-all font-medium">
                <Mail size={17} className="shrink-0 text-purple-400" />
                {user.email}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Account ID</p>
              <p className="break-all font-mono text-sm text-gray-300">
                {user.id}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Email Status</p>
              <p className="font-medium text-green-400">
                {user.isVerified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#171333] to-[#10152a] p-6 sm:p-8">

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
            <Trophy size={25} />
          </div>

          <h2 className="text-2xl font-bold">
            Hackathon Registration
          </h2>

          {registration ? (
            <div className="mt-5 space-y-5">

              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-300">
                <ShieldCheck size={16} />
                Registration Submitted
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-400">Project Name</p>
                  <p className="mt-1 font-semibold">
                    {registration.projectName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Domain</p>
                  <p className="mt-1 font-semibold">
                    {registration.domain}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">College</p>
                  <p className="mt-1 font-semibold">
                    {registration.college}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Team Size</p>
                  <p className="mt-1 font-semibold">
                    {registration.teamSize}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Registration Date</p>
                  <p className="mt-1 font-semibold">
                    {registrationDate}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="mt-1 font-semibold text-green-400">
                    {registration.registrationStatus}
                  </p>
                </div>

              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="mb-3 flex items-center gap-2 font-semibold">
                  <Users size={18} className="text-purple-400" />
                  Team Members
                </div>

                {registration.teamMembers?.length ? (
                  <div className="space-y-3">
                    {registration.teamMembers.map((member, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <p className="font-medium">
                          {index + 1}. {member.name}
                        </p>
                        <p className="mt-1 break-all text-sm text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    Solo participation – no additional team members.
                  </p>
                )}
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-sm text-gray-400">
                  PPT and prototype links
                </p>
                <a
                  href={registration.pptLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm text-purple-300 underline"
                >
                  View PPT
                </a>
                <a
                  href={registration.prototypeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block break-all text-sm text-purple-300 underline"
                >
                  View Prototype
                </a>
                {registration.demoVideoLink && (
                  <a
                    href={registration.demoVideoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm text-purple-300 underline"
                  >
                    View Demo Video
                  </a>
                )}
              </div>

            </div>
          ) : (
            <>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                You have not submitted your hackathon registration yet.
                Complete the registration form to submit your project and team information.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm text-yellow-300">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Not registered yet
              </div>

              <div>
                <Link
                  to="/hackathon/register"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3.5 font-semibold transition hover:brightness-110"
                >
                  Register Now
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          )}

        </section>

      </main>
    </div>
  )
}

export default Dashboard
