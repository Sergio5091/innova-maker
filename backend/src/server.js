require('dotenv').config()

const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const { testConnection } = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const auth = require('./middleware/auth')

// Routes publiques
const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')
const articlesRoutes = require('./routes/articles')
const servicesRoutes = require('./routes/services')
const contactsRoutes = require('./routes/contacts')
const quotesRoutes = require('./routes/quotes')
const newsletterRoutes = require('./routes/newsletter')

// Routes admin
const adminStatsRoutes = require('./routes/admin/stats')
const adminContactsRoutes = require('./routes/admin/contacts')
const adminQuotesRoutes = require('./routes/admin/quotes')
const adminProductsRoutes = require('./routes/admin/products')
const adminArticlesRoutes = require('./routes/admin/articles')
const adminServicesRoutes = require('./routes/admin/services')
const adminCategoriesRoutes = require('./routes/admin/categories')
const adminNewsletterRoutes = require('./routes/admin/newsletter')

const app = express()

// Sécurité
app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN }))

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Trop de requêtes, réessayez plus tard.' },
}))

// Body parser
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API INOVA Makers opérationnelle' })
})

// Routes publiques
app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/services', servicesRoutes)
app.use('/api/contacts', contactsRoutes)
app.use('/api/quotes', quotesRoutes)
app.use('/api/newsletter', newsletterRoutes)

// Routes admin (toutes protégées par JWT)
app.use('/api/admin/stats', auth, adminStatsRoutes)
app.use('/api/admin/contacts', auth, adminContactsRoutes)
app.use('/api/admin/quotes', auth, adminQuotesRoutes)
app.use('/api/admin/products', auth, adminProductsRoutes)
app.use('/api/admin/articles', auth, adminArticlesRoutes)
app.use('/api/admin/services', auth, adminServicesRoutes)
app.use('/api/admin/categories', auth, adminCategoriesRoutes)
app.use('/api/admin/newsletter', auth, adminNewsletterRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' })
})

// Error handler
app.use(errorHandler)

// Démarrage
const PORT = process.env.PORT || 8000

async function start() {
  await testConnection()
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  })
}

start().catch((err) => {
  console.error('❌ Impossible de démarrer le serveur:', err.message)
  process.exit(1)
})
