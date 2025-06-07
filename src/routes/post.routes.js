const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  createPost,
  getAllPosts,
  addCommentToPost,
  likePost,
} = require("../controllers/post.controller");

// UBAHAN: Import middleware upload lokal yang baru
const upload = require("../middleware/upload");

const createPostLimiter = rateLimit({
  windowMs: 2 * 24 * 60 * 60 * 1000,
  max: 100,
  message: {
    error: "Anda baru saja mengirim postingan. Coba lagi dalam 2 hari.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Definisi Endpoint API
router.get("/posts", getAllPosts);

// UBAHAN: Terapkan middleware upload lokal
// Middleware ini akan menangani multipart/form-data dan error (misal: file terlalu besar)
router.post(
  "/posts",
  (req, res, next) => {
    createPostLimiter(req, res, (limiterErr) => {
      if (limiterErr) return res.status(429).json(limiterErr);

      upload(req, res, (uploadErr) => {
        if (uploadErr) {
          // Tangani error dari multer (misal: ukuran file, tipe file)
          return res.status(400).json({ error: uploadErr.message });
        }
        // Jika semua middleware berhasil, lanjutkan ke controller
        next();
      });
    });
  },
  createPost
);

router.post("/posts/:postId/comments", addCommentToPost);
router.post("/posts/:postId/likes", likePost);

module.exports = router;
