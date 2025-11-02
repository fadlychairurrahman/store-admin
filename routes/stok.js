const express = require('express');
const router = express.Router();
const db = require('../db/koneksi');

// 📦 Tampilkan halaman stok
router.get('/', (req, res) => {
  // Ambil semua stok + nama produk
  const queryStok = `
    SELECT stok.*, produk.nama_produk
    FROM stok
    JOIN produk ON stok.id_produk = produk.id
  `;
  db.query(queryStok, (err, stokResults) => {
    if (err) throw err;

    // Ambil semua produk untuk dropdown
    db.query('SELECT id, nama_produk FROM produk', (err2, produkResults) => {
      if (err2) throw err2;

      // Render ke halaman EJS
      res.render('stok/index', {
        stok: stokResults,
        produk: produkResults,
        editData: null // default tidak sedang edit
      });
    });
  });
});

// ✏️ Tampilkan data stok yang ingin diedit
router.get('/edit/:id', (req, res) => {
  const { id } = req.params;

  // Ambil data stok berdasarkan ID
  db.query('SELECT * FROM stok WHERE id = ?', [id], (err, stokResults) => {
    if (err) throw err;

    if (stokResults.length === 0) {
      return res.send('❌ Data stok tidak ditemukan.');
    }

    // Ambil juga semua produk untuk dropdown
    db.query('SELECT id, nama_produk FROM produk', (err2, produkResults) => {
      if (err2) throw err2;

      // Render halaman stok + data yang sedang diedit
      db.query(`
        SELECT stok.*, produk.nama_produk 
        FROM stok 
        JOIN produk ON stok.id_produk = produk.id
      `, (err3, allStok) => {
        if (err3) throw err3;

        res.render('stok/index', {
          stok: allStok,
          produk: produkResults,
          editData: stokResults[0] // kirim data stok yang akan diedit
        });
      });
    });
  });
});

// 💾 Simpan / Tambah / Update stok
router.post('/simpan', (req, res) => {
  const { id, id_produk, jumlah } = req.body;

  if (!id_produk || !jumlah) {
    return res.send('❌ Harap isi semua kolom!');
  }

  if (id && id !== '') {
    // Update stok berdasarkan ID
    const queryUpdate = 'UPDATE stok SET id_produk = ?, jumlah = ? WHERE id = ?';
    db.query(queryUpdate, [id_produk, jumlah, id], (err) => {
      if (err) throw err;
      res.redirect('/stok');
    });
  } else {
    // Tambah stok baru
    const queryInsert = 'INSERT INTO stok (id_produk, jumlah) VALUES (?, ?)';
    db.query(queryInsert, [id_produk, jumlah], (err) => {
      if (err) throw err;
      res.redirect('/stok');
    });
  }
});

// ❌ Hapus stok
router.get('/hapus/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM stok WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/stok');
  });
});

module.exports = router;
