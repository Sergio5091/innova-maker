const express = require('express')
const { pool } = require('../config/db')

const router = express.Router()

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query
    const conditions = ['is_active = TRUE']
    const params = []

    if (type) {
      conditions.push('type = ?')
      params.push(type)
    }

    const [rows] = await pool.query(
      `SELECT * FROM categories WHERE ${conditions.join(' AND ')} ORDER BY sort_order ASC`,
      params
    )

    res.json({ success: true, data: rows })
  } catch (err) {
    next(err)
  }
})

module.exports = router
