const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name as category_name FROM services s
       JOIN categories c ON s.category_id = c.id ORDER BY s.sort_order ASC`
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { name, slug, description, short_description, category_id, icon,
            color, bg_color, features, pricing, delivery_time, sort_order } = req.body

    const [result] = await pool.query(
      `INSERT INTO services (name, slug, description, short_description, category_id,
       icon, color, bg_color, features, pricing, delivery_time, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description, category_id, icon || null,
       color || null, bg_color || null,
       features ? JSON.stringify(features) : null,
       pricing ? JSON.stringify(pricing) : null,
       delivery_time || null, sort_order || 0]
    )
    res.status(201).json({ success: true, message: 'Service créé', id: result.insertId })
  } catch (err) { next(err) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { name, slug, description, short_description, category_id, icon,
            color, bg_color, features, pricing, delivery_time, is_active, sort_order } = req.body

    await pool.query(
      `UPDATE services SET name=?, slug=?, description=?, short_description=?, category_id=?,
       icon=?, color=?, bg_color=?, features=?, pricing=?, delivery_time=?, is_active=?, sort_order=?
       WHERE id=?`,
      [name, slug, description, short_description, category_id, icon, color, bg_color,
       features ? JSON.stringify(features) : null,
       pricing ? JSON.stringify(pricing) : null,
       delivery_time, is_active, sort_order, req.params.id]
    )
    res.json({ success: true, message: 'Service mis à jour' })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM services WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Service introuvable' })
    res.json({ success: true, message: 'Service supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
