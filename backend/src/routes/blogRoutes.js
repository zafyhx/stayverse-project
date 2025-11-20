// backend/src/routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// --- Routes untuk Blog ---
router.get('/', blogController.getAllBlogs); // Ambil semua blog
router.get('/:id', blogController.getBlogById); // Ambil blog berdasarkan ID
router.post('/', blogController.createBlog); // Buat blog baru
router.put('/:id', blogController.updateBlog); // Update blog
router.delete('/:id', blogController.deleteBlog); // Hapus blog

module.exports = router;
