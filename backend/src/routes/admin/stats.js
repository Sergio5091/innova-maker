const express = require('express')
const { pool } = require('../../config/db')

const router = express.Router()

// GET /api/admin/stats
router.get('/', async (req, res, next) => {
  try {
    const [[contacts]] = await pool.query('SELECT COUNT(*) as total, SUM(status = "new") as new_count FROM contacts')
    const [[quotes]] = await pool.query('SELECT COUNT(*) as total, SUM(status = "pending") as pending_count FROM quote_requests')
    const [[newsletter]] = await pool.query('SELECT COUNT(*) as total FROM newsletter_subscribers WHERE is_active = TRUE')
    const [[products]] = await pool.query('SELECT COUNT(*) as total, SUM(is_active = TRUE) as active_count FROM products')
    const [[articles]] = await pool.query('SELECT COUNT(*) as total, SUM(is_published = TRUE) as published_count FROM articles')
    const [[services]] = await pool.query('SELECT COUNT(*) as total FROM services WHERE is_active = TRUE')

    // Évolution contacts + devis sur 30 derniers jours
    const [contactsChart] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM contacts
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at) ORDER BY date ASC`
    )
    const [quotesChart] = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM quote_requests
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at) ORDER BY date ASC`
    )

    // Derniers contacts et devis
    const [latestContacts] = await pool.query(
      'SELECT id, name, email, subject, status, created_at FROM contacts ORDER BY created_at DESC LIMIT 5'
    )
    const [latestQuotes] = await pool.query(
      'SELECT id, name, email, service_id, status, priority, created_at FROM quote_requests ORDER BY created_at DESC LIMIT 5'
    )

    res.json({
      success: true,
      data: {
        stats: { contacts, quotes, newsletter, products, articles, services },
        charts: { contacts: contactsChart, quotes: quotesChart },
        latest: { contacts: latestContacts, quotes: latestQuotes },
      },
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
