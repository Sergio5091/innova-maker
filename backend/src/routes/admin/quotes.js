const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

// GET /api/admin/quotes
router.get('/', async (req, res, next) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = []
    const params = []

    if (status) { conditions.push('q.status = ?'); params.push(status) }
    if (priority) { conditions.push('q.priority = ?'); params.push(priority) }
    if (search) {
      conditions.push('(q.name LIKE ? OR q.email LIKE ? OR q.project_type LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT q.*, s.name as service_name FROM quote_requests q
       LEFT JOIN services s ON q.service_id = s.id
       ${where} ORDER BY q.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM quote_requests q ${where}`, params
    )

    res.json({ success: true, data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) { next(err) }
})

// GET /api/admin/quotes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT q.*, s.name as service_name FROM quote_requests q
       LEFT JOIN services s ON q.service_id = s.id WHERE q.id = ?`,
      [req.params.id]
    )
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Devis introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

// PATCH /api/admin/quotes/:id
router.patch('/:id', async (req, res, next) => {
  try {
    const { status, priority, assigned_to, notes } = req.body
    const fields = []
    const params = []

    if (status) { fields.push('status = ?'); params.push(status) }
    if (priority) { fields.push('priority = ?'); params.push(priority) }
    if (assigned_to !== undefined) { fields.push('assigned_to = ?'); params.push(assigned_to) }
    if (notes !== undefined) { fields.push('notes = ?'); params.push(notes) }

    if (fields.length === 0) return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' })

    params.push(req.params.id)
    await pool.query(`UPDATE quote_requests SET ${fields.join(', ')} WHERE id = ?`, params)
    res.json({ success: true, message: 'Devis mis à jour' })
  } catch (err) { next(err) }
})

// DELETE /api/admin/quotes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM quote_requests WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Devis introuvable' })
    res.json({ success: true, message: 'Devis supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
