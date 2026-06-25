require('dotenv').config()

const bcrypt = require('bcryptjs')
const { pool } = require('../src/config/db')

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = 'Admin INOVA'

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL et ADMIN_PASSWORD requis dans .env')
    process.exit(1)
  }

  const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [email])

  if (existing.length > 0) {
    console.log('⚠️  Un admin avec cet email existe déjà')
    process.exit(0)
  }

  const hashed = await bcrypt.hash(password, 12)

  await pool.query(
    'INSERT INTO admins (email, password, name) VALUES (?, ?, ?)',
    [email, hashed, name]
  )

  console.log(`✅ Admin créé : ${email}`)
  process.exit(0)
}

createAdmin().catch((err) => {
  console.error('❌ Erreur:', err.message)
  process.exit(1)
})
