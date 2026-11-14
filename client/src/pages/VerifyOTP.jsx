
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Mail, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function VerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()

  const email =
    location.state?.email ||
    sessionStorage.getItem('verificationEmail') ||
    ''

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid six-digit OTP.')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { email, otp }
      )

      if (response.data.success) {
        sessionStorage.removeItem('verificationEmail')
        navigate('/login', {
          state: {
            message: 'Email verified successfully. You can now log in.',
            email,
          },
        })
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'OTP verification failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setMessage('')

    try {
      setResending(true)

      const response = await axios.post(
        `${API_URL}/api/auth/resend-otp`,
        { email }
      )

      setMessage(response.data.message)
      setOtp('')
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to resend OTP. Please try again.'
      )
    } finally {
      setResending(false)
    }
  }

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 text-white">
        <div className="max-w-md rounded-3xl border border-white/10 bg-[#10152a] p-8 text-center">
          <h1 className="text-2xl font-bold">Email not found</h1>
          <p className="mt-3 text-gray-400">
            Please sign up first to receive your verification OTP.
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b18] px-4 py-10 text-white">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#10152a] p-7 shadow-2xl sm:p-9">

        <Link
          to="/signup"
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Signup
        </Link>

        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-600/20 text-purple-400">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-3xl font-bold">
            Verify Your Email
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            We've sent a six-digit verification code to
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-purple-300">
            <Mail size={16} />
            <span className="break-all">{email}</span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-5">

          <div>
            <label className="mb-3 block text-sm text-gray-300">
              Enter your six-digit OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="000000"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] text-white outline-none placeholder:text-gray-600 focus:border-purple-500"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {message && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 font-semibold transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>

        </form>

        <div className="mt-7 border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            Didn't receive the OTP?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 disabled:opacity-50"
          >
            <RefreshCw size={16} className={resending ? 'animate-spin' : ''} />
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>

          <p className="mt-4 text-xs text-gray-500">
            Your OTP is valid for 10 minutes.
          </p>
        </div>

      </div>
    </div>
  )
}

export default VerifyOTP
