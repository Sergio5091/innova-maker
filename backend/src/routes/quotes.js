const express = require('express')
const { z } = require('zod')
const { pool } = require('../config/db')
const validate = require('../middleware/validate')

const router = express.Router()

const quoteSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email('Email invalide'),
  phone: z.string().min(6).max(20),
  company: z.string().max(255).optional(),
  service_id: z.number().int().positive().nullable().optional(),
  project_type: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  description: z.string().min(10, 'Description trop courte'),
  features: z.array(z.string()).optional(),
})

// POST /api/quotes
router.post('/', validate(quoteSchema), async (req, res, next) => {
  try {
    const {
      name, email, phone, company, service_id,
      project_type, budget, timeline, description, features,
    } = req.body

    await pool.query(
      `INSERT INTO quote_requests
       (name, email, phone, company, service_id, project_type, budget, timeline, description, features, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, company || null, service_id || null,
       project_type || null, budget || null, timeline || null,
       description, features ? JSON.stringify(features) : null,
       req.ip, req.headers['user-agent'] || null]
    )

    res.status(201).json({ success: true, message: 'Demande de devis envoyée avec succès' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
