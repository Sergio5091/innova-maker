const express = require('express')
const { z } = require('zod')
const { pool } = require('../config/db')
const validate = require('../middleware/validate')

const router = express.Router()

const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court').max(255),
  email: z.string().email('Email invalide'),
  phone: z.string().max(20).optional(),
  company: z.string().max(255).optional(),
  subject: z.string().min(2).max(255),
  message: z.string().min(10, 'Message trop court'),
  type: z.enum(['general', 'support', 'partnership', 'complaint']).default('general'),
})

// POST /api/contacts
router.post('/', validate(contactSchema), async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message, type } = req.body

    await pool.query(
      `INSERT INTO contacts (name, email, phone, company, subject, message, type, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, company || null, subject, message, type,
       req.ip, req.headers['user-agent'] || null]
    )

    res.status(201).json({ success: true, message: 'Message envoyé avec succès' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
