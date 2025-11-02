const express = require('express');
const router = express.Router();
const db = require('../db/koneksi');

// 📋 Tampilkan daftar pembelian
router.get('/', (req, res) => {
  const queryPembelian = `
    SELECT pembelian.*, produk.nama_produk
    FROM pembelian
    JOIN produk ON pembelian.id_produk = produk.id
  `;

  db.query(queryPembelian, (err, pembelianResults) => {
    if (err) throw err;

    db.query('SELECT * FROM produk', (err2, produkResults) => {
      if (err2) throw err2;

      res.render('pembelian/index', {
        pembelian: pembelianResults || [],
        produk: produkResults || [],
        editData: null
      });
    });
  });
});

// ➕ Tambah / Edit Pembelian
router.post('/simpan', (req, res) => {
  let { id, id_produk, jumlah, status } = req.body;

  // Default status ke "selesai" jika tidak diisi
  if (!status || status.trim() === '') {
    status = 'selesai';
  }

  // Ambil harga produk dulu
  db.query('SELECT harga FROM produk WHERE id = ?', [id_produk], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const harga = results[0].harga;
      const total = harga * jumlah;

      if (id && id !== '') {
        // Update data pembelian
        const queryUpdate = `
          UPDATE pembelian 
          SET id_produk = ?, jumlah = ?, total_harga = ?, status = ?
          WHERE id = ?
        `;
        db.query(queryUpdate, [id_produk, jumlah, total, status, id], (err2) => {
          if (err2) throw err2;
          res.redirect('/pembelian');
        });
      } else {
        // Tambah data baru
        const queryInsert = `
          INSERT INTO pembelian (id_produk, jumlah, total_harga, tanggal, status)
          VALUES (?, ?, ?, NOW(), ?)
        `;
        db.query(queryInsert, [id_produk, jumlah, total, status], (err3) => {
          if (err3) throw err3;
          res.redirect('/pembelian');
        });
      }
    } else {
      res.send('Produk tidak ditemukan!');
    }
  });
});

// ✏️ Form Edit Pembelian
router.get('/edit/:id', (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT pembelian.*, produk.nama_produk
    FROM pembelian
    JOIN produk ON pembelian.id_produk = produk.id
    WHERE pembelian.id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) return res.send('Data tidak ditemukan.');

    const editData = results[0];

    db.query('SELECT * FROM produk', (err2, produkResults) => {
      if (err2) throw err2;

      res.render('pembelian/index', {
        pembelian: [],
        produk: produkResults || [],
        editData
      });
    });
  });
});

// 🗑️ Hapus Pembelian
router.get('/hapus/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM pembelian WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/pembelian');
  });
});

// 🚫 Batalkan Pembelian
router.get('/batal/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE pembelian SET status = "cancelled" WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/pembelian');
  });
});

module.exports = router;
