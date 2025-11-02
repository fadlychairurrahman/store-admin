const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'containers-us-west-99.railway.app', // default ke host publik
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'jkQQeSdhlUEmbLpfrxVoAGvPhhzXhqaI',
  database: process.env.DB_NAME || 'railway',
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
