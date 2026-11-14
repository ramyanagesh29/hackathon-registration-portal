
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Save, Link as LinkIcon } from 'lucide-react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

function EditRegistrationLinks() {
  const navigate = useNavigate()

  const [pptLink, setPptLink] = useState('')
  const [prototypeLink, setPrototypeLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadRegistration = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/hackathon/my-entry`,
          { withCredentials: true }
        )

        const registration = response.data.registration

        if (!registration) {
          setError('No hackathon registration found.')
          return
        }

        setPptLink(registration.pptLink || '')
        setPrototypeLink(registration.prototypeLink || '')
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load registration details.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadRegistration()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    try {
      const ppt = new URL(pptLink.trim())
      const prototype = new URL(prototypeLink.trim())

      if (
        !['http:', 'https:'].includes(ppt.protocol) ||
        !['http:', 'https:'].includes(prototype.protocol)
      ) {
        throw new Error('Only HTTP and HTTPS links are allowed.')
      }
    } catch (err) {
      setError(
        err.message === 'Only HTTP and HTTPS links are allowed.'
          ? err.message
          : 'Please enter valid PPT and prototype URLs.'
      )
      return
    }

    try {
      setSaving(true)

      const response = await axios.put(
        `${API_URL}/api/hackathon/update-links`,
        {
          pptLink: pptLink.trim(),
          prototypeLink: prototypeLink.trim(),
        },
        { withCredentials: true }
      )

      setSuccess(response.data.message || 'Links updated successfully.')

      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to update registration links.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading registration...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-400">
              <LinkIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Edit Registration Links
              </h1>
              <p className="text-sm text-slate-400">
                Update your PPT and prototype URLs.
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                PPT / Presentation Link
              </label>
              <input
                type="url"
                required
                value={pptLink}
                onChange={(e) => setPptLink(e.target.value)}
                placeholder="https://docs.google.com/presentation/d/..."
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Prototype / GitHub Link
              </label>
              <input
                type="url"
                required
                value={prototypeLink}
                onChange={(e) => setPrototypeLink(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            <p className="text-xs text-slate-400">
              Only these two links will be updated. Your project,
              registration and team member details will remain unchanged.
            </p>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Updated Links'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditRegistrationLinks
