const express = require('express')
const { pool } = require('../config/db')

const router = express.Router()

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 12 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = ['p.is_active = TRUE']
    const params = []

    if (category) {
      conditions.push('c.slug = ?')
      params.push(category)
    }
    if (featured === 'true') {
      conditions.push('p.is_featured = TRUE')
    }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.short_description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = conditions.join(' AND ')

    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE ${where}
       ORDER BY p.is_featured DESC, p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE ${where}`,
      params
    )

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/products/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ? AND p.is_active = TRUE`,
      [req.params.slug]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
})

module.exports = router
