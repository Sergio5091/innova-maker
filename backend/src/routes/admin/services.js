const express = require('express')
const { pool } = require('../../config/db')
const validate = require('../../middleware/validate')
const { buildInsert, buildUpdate } = require('../../utils/sql')
const { serviceSchema, serviceUpdateSchema } = require('../../schemas/admin')

const router = express.Router()
const JSON_FIELDS = ['features', 'pricing']

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, c.name as category_name FROM services s
       JOIN categories c ON s.category_id = c.id ORDER BY s.sort_order ASC`
    )
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Service introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

router.post('/', validate(serviceSchema), async (req, res, next) => {
  try {
    const { sql, params } = buildInsert('services', req.body, JSON_FIELDS)
    const [result] = await pool.query(sql, params)
    res.status(201).json({ success: true, message: 'Service créé', id: result.insertId })
  } catch (err) { next(err) }
})

// PUT — mise à jour partielle : seuls les champs envoyés sont modifiés
router.put('/:id', validate(serviceUpdateSchema), async (req, res, next) => {
  try {
    const query = buildUpdate('services', req.body, req.params.id, JSON_FIELDS)
    if (!query) return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' })

    const [result] = await pool.query(query.sql, query.params)
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Service introuvable' })
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
