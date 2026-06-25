const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

async function testConnection() {
  const conn = await pool.getConnection()
  console.log('✅ MySQL connecté — base:', process.env.DB_NAME)
  conn.release()
}

module.exports = { pool, testConnection }
