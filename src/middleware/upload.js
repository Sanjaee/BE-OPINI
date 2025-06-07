const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan disk untuk Multer
const storage = multer.diskStorage({
  // Menentukan folder tujuan penyimpanan file
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  // Menentukan nama file yang akan disimpan
  filename: function (req, file, cb) {
    // Membuat nama file unik: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter untuk memastikan hanya file gambar yang di-upload
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extname) {
    return cb(null, true);
  }
  cb(new Error('Error: Hanya file gambar (jpeg, jpg, png) yang diizinkan!'));
};

// Inisialisasi Multer dengan konfigurasi yang telah dibuat
const upload = multer({
  storage: storage,
  // Menambahkan batasan ukuran file
  limits: {
    fileSize: 3 * 1024 * 1024 // 3 MB dalam bytes
  },
  fileFilter: fileFilter
}).single('image'); // Menerima satu file dari field bernama 'image'

module.exports = upload;
