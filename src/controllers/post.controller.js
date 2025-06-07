const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config(); // Pastikan dotenv di-load

// Fungsi untuk membuat postingan baru (dengan URL yang siap untuk VPS)
const createPost = async (req, res) => {
  try {
    const { content, author } = req.body;
    let imageUrl = null;

    if (req.file) {
      // UBAHAN: Menggunakan BASE_URL dari .env untuk URL yang fleksibel
      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      imageUrl = `${baseUrl}/images/${req.file.filename}`;
    }

    if (!content && !imageUrl) {
      return res
        .status(400)
        .json({ error: "Konten atau gambar tidak boleh kosong." });
    }

    const post = await prisma.post.create({
      data: {
        content: content || "",
        author: author || "Anonim",
        imageUrl: imageUrl,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal membuat postingan.", details: error.message });
  }
};

// ... (Fungsi lainnya tidak berubah) ...

const getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { comments: true, likes: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Gagal mengambil data postingan.",
        details: error.message,
      });
  }
};

const addCommentToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, author } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Komentar tidak boleh kosong." });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        author: author || "Anonim",
        postId: parseInt(postId),
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal menambahkan komentar.", details: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const like = await prisma.like.create({
      data: { postId: parseInt(postId) },
    });
    res
      .status(201)
      .json({ message: "Post berhasil di-like!", likeId: like.id });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Gagal me-like postingan.", details: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  addCommentToPost,
  likePost,
};
