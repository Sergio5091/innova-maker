const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/db')
const auth = require('../middleware/auth')

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' })
    }

    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE email = ? AND is_active = TRUE',
      [email]
    )

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' })
    }

    const admin = rows[0]
    const valid = await bcrypt.compare(password, admin.password)

    if (!valid) {
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' })
    }

    // Mettre à jour last_login
    await pool.query('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id])

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/auth/logout
router.post('/logout', auth, (req, res) => {
  // Le token est invalidé côté client (suppression du localStorage/cookie)
  res.json({ success: true, message: 'Déconnexion réussie' })
})

// GET /api/auth/me
router.get('/me', auth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, email, name, last_login, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Admin introuvable' })
    }

    res.json({ success: true, admin: rows[0] })
  } catch (err) {
    next(err)
  }
})

module.exports = router
