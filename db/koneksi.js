const mysql = require('mysql2');

// Gunakan environment variables Railway
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'containers-us-west-99.railway.app', // default Railway host
  user: process.env.DB_USER || 'root',                               // default user
  password: process.env.DB_PASS || 'hX3sd9H2fj9d...',               // default password
  database: process.env.DB_NAME || 'railway',                        // default database
  port: process.env.DB_PORT || 3306                                  // port default
});

db.connect((err) => {
  if (err) {
    console.error('❌ Koneksi database gagal:', err.message);
  } else {
    console.log('✅ Terhubung ke database MySQL');
  }
});

module.exports = db;
