
const checkOrigin = (req, res, next) => {
  // Allow requests that do not modify application data
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  const expectedOrigin = process.env.CLIENT_URL
  const requestOrigin = req.get('Origin')

  // Reject missing or unexpected origins
  if (!expectedOrigin || !requestOrigin || requestOrigin !== expectedOrigin) {
    return res.status(403).json({
      success: false,
      message: 'Request origin is not allowed.',
    })
  }

  next()
}

module.exports = checkOrigin
