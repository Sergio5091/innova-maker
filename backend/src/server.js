require('dotenv').config()

const app = require('./app')
const { testConnection } = require('./config/db')

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
