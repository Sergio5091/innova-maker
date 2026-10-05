const express = require('express')
const { pool } = require('../../config/db')
const validate = require('../../middleware/validate')
const { buildUpdate } = require('../../utils/sql')
const { contactPatchSchema } = require('../../schemas/admin')

const router = express.Router()

// GET /api/admin/contacts
router.get('/', async (req, res, next) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = []
    const params = []

    if (status) { conditions.push('status = ?'); params.push(status) }
    if (type) { conditions.push('type = ?'); params.push(type) }
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR subject LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT * FROM contacts ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM contacts ${where}`, params
    )

    res.json({ success: true, data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) { next(err) }
})

// GET /api/admin/contacts/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Contact introuvable' })
    // Marquer comme lu
    if (rows[0].status === 'new') {
      await pool.query('UPDATE contacts SET status = "read" WHERE id = ?', [req.params.id])
      rows[0].status = 'read'
    }
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

// PATCH /api/admin/contacts/:id
router.patch('/:id', validate(contactPatchSchema), async (req, res, next) => {
  try {
    const query = buildUpdate('contacts', req.body, req.params.id)
    if (!query) return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' })

    const [result] = await pool.query(query.sql, query.params)
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Contact introuvable' })
    res.json({ success: true, message: 'Contact mis à jour' })
  } catch (err) { next(err) }
})

// DELETE /api/admin/contacts/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Contact introuvable' })
    res.json({ success: true, message: 'Contact supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
