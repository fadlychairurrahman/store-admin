const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const produkRoutes = require('./routes/produk');
const pembelianRoutes = require('./routes/pembelian');
const stokRoutes = require('./routes/stok');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/produk', produkRoutes);
app.use('/pembelian', pembelianRoutes);
app.use('/stok', stokRoutes);

// Halaman utama
app.get('/', (req, res) => {
  res.render('index');
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
