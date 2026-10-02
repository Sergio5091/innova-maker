// Tests d'intégration sans base de données : on vérifie tout ce qui est rejeté
// AVANT d'atteindre MySQL (auth, validation Zod, 404). Lancer avec : npm test
process.env.JWT_SECRET = 'test-secret'
process.env.NODE_ENV = 'test'

const { test, before, after } = require('node:test')
const assert = require('node:assert')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

let server
let baseUrl
const adminToken = jwt.sign({ id: 1, email: 'admin@test.io', name: 'Admin' }, 'test-secret', { expiresIn: '1h' })

before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}/api`
})

after(() => {
  server.close()
  require('../src/config/db').pool.end()
})

async function call(method, path, { body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${baseUrl}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  return { status: res.status, data: await res.json() }
}

test('GET /health répond 200', async () => {
  const { status, data } = await call('GET', '/health')
  assert.strictEqual(status, 200)
  assert.strictEqual(data.success, true)
})

test('route inconnue → 404', async () => {
  const { status } = await call('GET', '/nexiste-pas')
  assert.strictEqual(status, 404)
})

test('routes admin sans token → 401', async () => {
  for (const path of ['/admin/stats', '/admin/contacts', '/admin/products', '/admin/articles']) {
    const { status } = await call('GET', path)
    assert.strictEqual(status, 401, path)
  }
})

test('routes admin avec token invalide → 401', async () => {
  const { status } = await call('GET', '/admin/stats', { token: 'faux.token.jwt' })
  assert.strictEqual(status, 401)
})

test('routes admin avec token expiré → 401', async () => {
  const expired = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: -10 })
  const { status } = await call('GET', '/admin/stats', { token: expired })
  assert.strictEqual(status, 401)
})

test('login sans identifiants → 400', async () => {
  const { status } = await call('POST', '/auth/login', { body: {} })
  assert.strictEqual(status, 400)
})

test('POST /contacts avec email invalide → 400 + détail du champ', async () => {
  const { status, data } = await call('POST', '/contacts', {
    body: { name: 'Jean', email: 'pas-un-email', subject: 'Test', message: 'Un message assez long' },
  })
  assert.strictEqual(status, 400)
  assert.ok(data.errors.some((e) => e.field === 'email'))
})

test('POST /quotes sans description → 400', async () => {
  const { status, data } = await call('POST', '/quotes', {
    body: { name: 'Jean', email: 'jean@test.io', phone: '0102030405' },
  })
  assert.strictEqual(status, 400)
  assert.ok(data.errors.some((e) => e.field === 'description'))
})

test('POST /newsletter avec email invalide → 400', async () => {
  const { status } = await call('POST', '/newsletter', { body: { email: 'nope' } })
  assert.strictEqual(status, 400)
})

test('POST /admin/products avec données invalides → 400', async () => {
  const { status, data } = await call('POST', '/admin/products', {
    token: adminToken,
    body: { name: 'X', slug: 'Slug Invalide', price: -5 },
  })
  assert.strictEqual(status, 400)
  const fields = data.errors.map((e) => e.field)
  assert.ok(fields.includes('slug'))
  assert.ok(fields.includes('price'))
  assert.ok(fields.includes('category_id'))
})

test('PATCH /admin/quotes avec statut inconnu → 400', async () => {
  const { status } = await call('PATCH', '/admin/quotes/1', { token: adminToken, body: { status: 'nimporte' } })
  assert.strictEqual(status, 400)
})

test('PUT /admin/categories avec type inconnu → 400', async () => {
  const { status } = await call('PUT', '/admin/categories/1', { token: adminToken, body: { type: 'autre' } })
  assert.strictEqual(status, 400)
})
