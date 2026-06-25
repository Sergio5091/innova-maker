const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = ['is_active = TRUE']
    const params = []

    if (search) {
      conditions.push('(email LIKE ? OR name LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = `WHERE ${conditions.join(' AND ')}`
    const [rows] = await pool.query(
      `SELECT * FROM newsletter_subscribers ${where} ORDER BY subscribed_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM newsletter_subscribers ${where}`, params
    )

    res.json({ success: true, data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM newsletter_subscribers WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Abonné introuvable' })
    res.json({ success: true, message: 'Abonné supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
