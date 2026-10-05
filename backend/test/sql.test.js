const { test } = require('node:test')
const assert = require('node:assert')
const { buildInsert, buildUpdate } = require('../src/utils/sql')
const { productUpdateSchema } = require('../src/schemas/admin')

test('buildInsert ignore les champs undefined et sérialise les JSON', () => {
  const { sql, params } = buildInsert('products', { name: 'A', sku: undefined, images: ['x.jpg'] }, ['images'])
  assert.strictEqual(sql, 'INSERT INTO products (name, images) VALUES (?, ?)')
  assert.deepStrictEqual(params, ['A', '["x.jpg"]'])
})

test('buildUpdate ne touche que les champs envoyés', () => {
  const { sql, params } = buildUpdate('products', { is_active: false }, 7)
  assert.strictEqual(sql, 'UPDATE products SET is_active = ? WHERE id = ?')
  assert.deepStrictEqual(params, [false, 7])
})

test('buildUpdate garde NULL tel quel pour un champ JSON', () => {
  const { params } = buildUpdate('products', { images: null }, 1, ['images'])
  assert.deepStrictEqual(params, [null, 1])
})

test('buildUpdate sans champ → null', () => {
  assert.strictEqual(buildUpdate('products', {}, 1), null)
})

test('schéma produit : accepte une ligne MySQL brute (0/1, prix en chaîne) et supprime les champs inconnus', () => {
  const parsed = productUpdateSchema.parse({
    price: '15000.00', is_active: 0, is_featured: 1, sku: '', category_name: 'LED', created_at: '2026-01-01',
  })
  assert.deepStrictEqual(parsed, { price: 15000, is_active: false, is_featured: true, sku: null })
})
