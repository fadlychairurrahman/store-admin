const mysql = require('mysql2');

const koneksi = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'admin_toko'
});

koneksi.connect(err => {
  if (err) throw err;
  console.log('Terhubung ke database MySQL');
});

module.exports = koneksi;
