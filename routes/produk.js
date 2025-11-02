const express = require('express');
const router = express.Router();
const db = require('../db/koneksi');

// 🧾 Tampilkan daftar produk
router.get('/', (req, res) => {
  db.query('SELECT * FROM produk', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal memuat data produk');
    }
    res.render('produk/index', { produk: results });
  });
});

// ➕ Tambah produk
router.post('/tambah', (req, res) => {
  const { nama_produk, harga, deskripsi } = req.body;
  db.query(
    'INSERT INTO produk (nama_produk, harga, deskripsi) VALUES (?, ?, ?)',
    [nama_produk, harga, deskripsi],
    (err) => {
      if (err) throw err;
      res.redirect('/produk');
    }
  );
});

// 🖋️ Tampilkan form edit produk
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM produk WHERE id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.send('Produk tidak ditemukan');
    }
    res.render('produk/edit', { produk: results[0] });
  });
});

// 💾 Proses update produk
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { nama_produk, harga, deskripsi } = req.body;

  db.query(
    'UPDATE produk SET nama_produk = ?, harga = ?, deskripsi = ? WHERE id = ?',
    [nama_produk, harga, deskripsi, id],
    (err) => {
      if (err) throw err;
      res.redirect('/produk');
    }
  );
});

// ❌ Hapus produk
router.get('/hapus/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM produk WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/produk');
  });
});

module.exports = router;
