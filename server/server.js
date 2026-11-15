
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')

const connectDB = require('./config/db')
const checkOrigin = require('./middleware/checkOrigin')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const hackathonRoutes = require('./routes/hackathonRoutes')

const app = express()

// Trust the Render reverse proxy
app.set('trust proxy', 1)

// Security headers
app.use(helmet())

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))

// Request middleware
app.use(express.json())
app.use(cookieParser())

// Validate browser request origins
app.use(checkOrigin)

// Backend health endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Code-a-Nova backend is running!',
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/hackathon', hackathonRoutes)

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
