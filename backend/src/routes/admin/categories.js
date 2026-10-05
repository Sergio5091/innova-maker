const express = require('express')
const { pool } = require('../../config/db')
const validate = require('../../middleware/validate')
const { buildInsert, buildUpdate } = require('../../utils/sql')
const { categorySchema, categoryUpdateSchema } = require('../../schemas/admin')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY type, sort_order ASC')
    res.json({ success: true, data: rows })
  } catch (err) { next(err) }
})

router.post('/', validate(categorySchema), async (req, res, next) => {
  try {
    const { sql, params } = buildInsert('categories', req.body)
    const [result] = await pool.query(sql, params)
    res.status(201).json({ success: true, message: 'Catégorie créée', id: result.insertId })
  } catch (err) { next(err) }
})

// PUT — mise à jour partielle : seuls les champs envoyés sont modifiés
router.put('/:id', validate(categoryUpdateSchema), async (req, res, next) => {
  try {
    const query = buildUpdate('categories', req.body, req.params.id)
    if (!query) return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' })

    const [result] = await pool.query(query.sql, query.params)
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Catégorie introuvable' })
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
