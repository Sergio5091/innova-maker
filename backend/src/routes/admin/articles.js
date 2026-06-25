const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

// GET /api/admin/articles
router.get('/', async (req, res, next) => {
  try {
    const { search, category, published, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = []
    const params = []

    if (category) { conditions.push('c.slug = ?'); params.push(category) }
    if (published !== undefined) { conditions.push('a.is_published = ?'); params.push(published === 'true') }
    if (search) {
      conditions.push('(a.title LIKE ? OR a.author_name LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.author_name, a.is_published, a.is_featured,
              a.read_time, a.published_at, a.created_at, c.name as category_name
       FROM articles a JOIN categories c ON a.category_id = c.id
       ${where} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM articles a JOIN categories c ON a.category_id = c.id ${where}`, params
    )

    res.json({ success: true, data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) { next(err) }
})

// POST /api/admin/articles
router.post('/', async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, category_id, author_name, author_email,
            author_bio, featured_image, read_time, tags, seo_title,
            seo_description, is_featured } = req.body

    const [result] = await pool.query(
      `INSERT INTO articles (title, slug, excerpt, content, category_id, author_name,
       author_email, author_bio, featured_image, read_time, tags, seo_title,
       seo_description, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt, content, category_id, author_name, author_email || null,
       author_bio || null, featured_image || null, read_time || null,
       tags ? JSON.stringify(tags) : null, seo_title || null,
       seo_description || null, is_featured || false]
    )

    res.status(201).json({ success: true, message: 'Article créé', id: result.insertId })
  } catch (err) { next(err) }
})

// PUT /api/admin/articles/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { title, slug, excerpt, content, category_id, author_name, author_email,
            author_bio, featured_image, read_time, tags, seo_title,
            seo_description, is_featured } = req.body

    await pool.query(
      `UPDATE articles SET title=?, slug=?, excerpt=?, content=?, category_id=?,
       author_name=?, author_email=?, author_bio=?, featured_image=?, read_time=?,
       tags=?, seo_title=?, seo_description=?, is_featured=? WHERE id=?`,
      [title, slug, excerpt, content, category_id, author_name, author_email || null,
       author_bio || null, featured_image || null, read_time || null,
       tags ? JSON.stringify(tags) : null, seo_title || null,
       seo_description || null, is_featured, req.params.id]
    )

    res.json({ success: true, message: 'Article mis à jour' })
  } catch (err) { next(err) }
})

// PATCH /api/admin/articles/:id/publish
router.patch('/:id/publish', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT is_published FROM articles WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Article introuvable' })

    const newStatus = !rows[0].is_published
    await pool.query(
      'UPDATE articles SET is_published = ?, published_at = ? WHERE id = ?',
      [newStatus, newStatus ? new Date() : null, req.params.id]
    )

    res.json({ success: true, message: newStatus ? 'Article publié' : 'Article dépublié', is_published: newStatus })
  } catch (err) { next(err) }
})

// DELETE /api/admin/articles/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Article introuvable' })
    res.json({ success: true, message: 'Article supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
