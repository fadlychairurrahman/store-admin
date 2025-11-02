const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,      // pakai env
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi database gagal:', err.message);
  } else {
    console.log('✅ Terhubung ke database MySQL');
  }
});

module.exports = db;
