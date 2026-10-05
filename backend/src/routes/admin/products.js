const express = require('express')
const { pool } = require('../../config/db')
const validate = require('../../middleware/validate')
const { buildInsert, buildUpdate } = require('../../utils/sql')
const { productSchema, productUpdateSchema } = require('../../schemas/admin')

const router = express.Router()
const JSON_FIELDS = ['images', 'features', 'specifications']

// GET /api/admin/products
router.get('/', async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)
    const conditions = []
    const params = []

    if (category) { conditions.push('c.slug = ?'); params.push(category) }
    if (search) {
      conditions.push('(p.name LIKE ? OR p.sku LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT p.*, c.name as category_name FROM products p
       JOIN categories c ON p.category_id = c.id
       ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    )
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM products p JOIN categories c ON p.category_id = c.id ${where}`, params
    )

    res.json({ success: true, data: rows, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } })
  } catch (err) { next(err) }
})

// GET /api/admin/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id])
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Produit introuvable' })
    res.json({ success: true, data: rows[0] })
  } catch (err) { next(err) }
})

// POST /api/admin/products
router.post('/', validate(productSchema), async (req, res, next) => {
  try {
    const { sql, params } = buildInsert('products', req.body, JSON_FIELDS)
    const [result] = await pool.query(sql, params)
    res.status(201).json({ success: true, message: 'Produit créé', id: result.insertId })
  } catch (err) { next(err) }
})

// PUT /api/admin/products/:id — mise à jour partielle : seuls les champs envoyés sont modifiés
router.put('/:id', validate(productUpdateSchema), async (req, res, next) => {
  try {
    const query = buildUpdate('products', req.body, req.params.id, JSON_FIELDS)
    if (!query) return res.status(400).json({ success: false, message: 'Aucun champ à mettre à jour' })

    const [result] = await pool.query(query.sql, query.params)
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Produit introuvable' })
    res.json({ success: true, message: 'Produit mis à jour' })
  } catch (err) { next(err) }
})

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id])
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Produit introuvable' })
    res.json({ success: true, message: 'Produit supprimé' })
  } catch (err) { next(err) }
})

module.exports = router
