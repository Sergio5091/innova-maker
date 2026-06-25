const express = require('express')
const { pool } = require('../config/db')

const router = express.Router()

// GET /api/services
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug
       FROM services s
       JOIN categories c ON s.category_id = c.id
       WHERE s.is_active = TRUE
       ORDER BY s.sort_order ASC`
    )
    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
})

// GET /api/services/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name as category_name, c.slug as category_slug
       FROM services s
       JOIN categories c ON s.category_id = c.id
       WHERE s.slug = ? AND s.is_active = TRUE`,
      [req.params.slug]
    )
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Service introuvable' })
    }
    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
})

module.exports = router
