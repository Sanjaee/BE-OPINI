const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const postRoutes = require('./src/routes/post.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- PERBAIKAN: Serv folder 'public/images' ---
// Membuat path absolut ke folder public/images
const imagesDirectoryPath = path.join(__dirname, 'public', 'images');

// Log path folder gambar untuk memastikan benar
console.log(`Mapping URL '/images' ke direktori: ${imagesDirectoryPath}`);

// Mengatur route statis agar file di public/images bisa diakses via /images
app.use('/images', express.static(imagesDirectoryPath));

// Route testing
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Keluh Kesah.' });
});

// Menggunakan routes API dengan prefix /api
app.use('/api', postRoutes);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
