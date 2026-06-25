const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY type, sort_order ASC')
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, slug, description, icon, type, parent_id, sort_order } = req.body
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, icon, type, parent_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description || null, icon || null, type, parent_id || null, sort_order || 0]
    )
    res.status(201).json({ success: true, message: 'Catégorie créée', id: result.insertId })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { name, slug, description, icon, type, parent_id, sort_order, is_active } = req.body
    await pool.query(
      'UPDATE categories SET name=?, slug=?, description=?, icon=?, type=?, parent_id=?, sort_order=?, is_active=? WHERE id=?',
      [name, slug, description, icon, type, parent_id || null, sort_order, is_active, req.params.id]
    )
    res.json({ success: true, message: 'Catégorie mise à jour' })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Catégorie introuvable' })
    res.json({ success: true, message: 'Catégorie supprimée' })
  } catch (err) { next(err) }
})

module.exports = router
