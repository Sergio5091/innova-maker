const express = require('express')
const { pool } = require('../config/db')

const router = express.Router()

// GET /api/articles
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, page = 1, limit = 9 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = ['a.is_published = TRUE', 'c.is_active = TRUE']
    const params = []

    if (category) {
      conditions.push('c.slug = ?')
      params.push(category)
    }
    if (featured === 'true') {
      conditions.push('a.is_featured = TRUE')
    }
    if (search) {
      conditions.push('(a.title LIKE ? OR a.excerpt LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = conditions.join(' AND ')

    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.author_name, a.featured_image,
              a.read_time, a.tags, a.is_featured, a.published_at,
              c.name as category_name, c.slug as category_slug
       FROM articles a
       JOIN categories c ON a.category_id = c.id
       WHERE ${where}
       ORDER BY a.is_featured DESC, a.published_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM articles a
       JOIN categories c ON a.category_id = c.id
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

// GET /api/articles/:slug
router.get('/:slug', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM articles a
       JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ? AND a.is_published = TRUE`,
      [req.params.slug]
    )

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article introuvable' })
    }

    res.json({ success: true, data: rows[0] })
  } catch (err) {
    next(err)
  }
})

module.exports = router
