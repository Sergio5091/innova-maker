const express = require('express')
const { z } = require('zod')
const { pool } = require('../config/db')
const validate = require('../middleware/validate')

const router = express.Router()

const subscribeSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().max(255).optional(),
})

// POST /api/newsletter
router.post('/', validate(subscribeSchema), async (req, res, next) => {
  try {
    const { email, name } = req.body

    const [existing] = await pool.query(
      'SELECT id, is_active FROM newsletter_subscribers WHERE email = ?',
      [email]
    )

    if (existing.length > 0) {
      if (existing[0].is_active) {
        return res.status(409).json({ success: false, message: 'Email déjà inscrit' })
      }
      // Réactivation si désabonné
      await pool.query(
        'UPDATE newsletter_subscribers SET is_active = TRUE, unsubscribed_at = NULL WHERE email = ?',
        [email]
      )
      return res.json({ success: true, message: 'Inscription réactivée avec succès' })
    }

    await pool.query(
      'INSERT INTO newsletter_subscribers (email, name, ip_address, source) VALUES (?, ?, ?, ?)',
      [email, name || null, req.ip, 'website']
    )

    res.status(201).json({ success: true, message: 'Inscription à la newsletter réussie' })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/newsletter/unsubscribe
router.delete('/unsubscribe', async (req, res, next) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requis' })
    }

    const [existing] = await pool.query(
      'SELECT id FROM newsletter_subscribers WHERE email = ? AND is_active = TRUE',
      [email]
    )

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Email non trouvé' })
    }

    await pool.query(
      'UPDATE newsletter_subscribers SET is_active = FALSE, unsubscribed_at = NOW() WHERE email = ?',
      [email]
    )

    res.json({ success: true, message: 'Désinscription réussie' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
