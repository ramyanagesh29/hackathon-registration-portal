
import { BrowserRouter, Routes, Route } from 'react-router-dom'


import Home from './pages/Home'
import Signup from './pages/Signup'
import VerifyOTP from './pages/VerifyOTP'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import HackathonRegistration from './pages/HackathonRegistration'

import ProtectedRoute from './components/ProtectedRoute'


function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080b18] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-3 text-gray-400">Page not found.</p>
        <a href="/" className="mt-5 inline-block text-purple-400">
          Return Home
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/hackathon/register"
    element={
      <ProtectedRoute>
        <HackathonRegistration />
      </ProtectedRoute>
    }
  />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
