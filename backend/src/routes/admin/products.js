const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

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

// POST /api/admin/products
router.post('/', async (req, res, next) => {
  try {
    const { name, slug, description, short_description, price, currency, category_id,
            sku, stock_quantity, badge, images, features, specifications, is_featured } = req.body

    const [result] = await pool.query(
      `INSERT INTO products (name, slug, description, short_description, price, currency,
       category_id, sku, stock_quantity, badge, images, features, specifications, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, short_description, price, currency || 'FCFA',
       category_id, sku || null, stock_quantity || 0, badge || null,
       images ? JSON.stringify(images) : null,
       features ? JSON.stringify(features) : null,
       specifications ? JSON.stringify(specifications) : null,
       is_featured || false]
    )

    res.status(201).json({ success: true, message: 'Produit créé', id: result.insertId })
  } catch (err) { next(err) }
})

// PUT /api/admin/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { name, slug, description, short_description, price, currency, category_id,
            sku, stock_quantity, stock_status, badge, images, features,
            specifications, is_featured, is_active } = req.body

    await pool.query(
      `UPDATE products SET name=?, slug=?, description=?, short_description=?, price=?,
       currency=?, category_id=?, sku=?, stock_quantity=?, stock_status=?, badge=?,
       images=?, features=?, specifications=?, is_featured=?, is_active=? WHERE id=?`,
      [name, slug, description, short_description, price, currency, category_id,
       sku, stock_quantity, stock_status,  badge,
       images ? JSON.stringify(images) : null,
       features ? JSON.stringify(features) : null,
       specifications ? JSON.stringify(specifications) : null,
       is_featured, is_active, req.params.id]
    )

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
