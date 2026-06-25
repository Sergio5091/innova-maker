function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Erreur interne du serveur'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${status}] ${req.method} ${req.path} —`, err.message)
  }

  res.status(status).json({
    success: false,
    message,
  })
}

module.exports = errorHandler
