// backend/src/controllers/blogController.js
const Blog = require('../models/Blog'); // Import model Blog

// --- Fungsi 1: Ambil SEMUA blog (GET) ---
const getAllBlogs = async (req, res) => {
    try {
        // Ambil semua blog dari database, urutkan berdasarkan tanggal terbaru
        const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });

        res.status(200).json(blogs); // Kirim data blogs dalam bentuk JSON

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Error handling
    }
};

// --- Fungsi 2: Buat blog BARU (POST) ---
const createBlog = async (req, res) => {
    try {
        // Ambil data dari body request (title, content, dll.)
        const { title, content, author, category } = req.body;

        // Validasi input sederhana
        if (!title || !content || !author) {
            return res.status(400).json({ message: 'Input tidak lengkap. Judul, isi, dan penulis wajib diisi.' });
        }

        // Handle image upload
        let imageUrl = 'https://via.placeholder.com/800x400.png?text=Blog+Image'; // Default placeholder
        if (req.file) {
            imageUrl = `/uploads/blogs/${req.file.filename}`;
        }

        // Perintah Sequelize: "INSERT INTO blogs (....) VALUES (....)"
        const newBlog = await Blog.create({
            title,
            content,
            author,
            category: category || 'General',
            imageUrl
        }); // Default category 'General' jika tidak ada

        // Kirim balasan sukses (201 = Created) dengan data blog yang baru dibuat
        res.status(201).json(newBlog); // Kirim data blog baru dalam bentuk JSON

    } catch (error) {
        // Kalau gagal (misal validasi Sequelize error), kirim balasan 500
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Error handling
    }
};

// --- FUNGSI 3: Ambil SATU blog (GET) ---
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari URL (misal: /blogs/1)

        // Cari blog berdasarkan Primary Key (ID)
        const blog = await Blog.findByPk(id); // Sequelize method untuk cari berdasarkan PK

        // Kalau blog-nya nggak ada
        if (!blog) {
            return res.status(404).json({ message: 'Blog tidak ditemukan' }); // 404 Not Found
        }

        // Kalau ada, kirim datanya
        res.status(200).json(blog); // Kirim data blog dalam bentuk JSON

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Error handling
    }
};

// --- FUNGSI 4: Update Blog (PUT) ---
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params; // ID yang mau di-edit
        const { title, content, author, category } = req.body; // Data baru dari body request

        // Cari blognya berdasarkan ID
        const blog = await Blog.findByPk(id); // Sequelize method untuk cari berdasarkan PK

        if (!blog) {
            return res.status(404).json({ message: 'Blog tidak ditemukan' }); // 404 Not Found jika tidak ada
        }

        // Update field-fieldnya (hanya yang dikirim saja, sisanya tetap sama)
        blog.title = title || blog.title; // Jika title tidak dikirim, tetap pakai yang lama
        blog.content = content || blog.content; // Jika content tidak dikirim, tetap pakai yang lama
        blog.author = author || blog.author; // Jika author tidak dikirim, tetap pakai yang lama
        blog.category = category || blog.category; // Jika category tidak dikirim, tetap pakai yang lama

        // Handle image upload - only update if new file is provided
        if (req.file) {
            blog.imageUrl = `/uploads/blogs/${req.file.filename}`;
        }

        // Simpan perubahan ke database
        await blog.save(); // Sequelize method untuk simpan perubahan

        res.status(200).json(blog); // Kirim data blog yang sudah di-update dalam bentuk JSON

    } catch (error) {
        console.error('Error updating blog:', error); // Log error untuk debugging
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Error handling
    }
};

// --- FUNGSI 5: Hapus Blog (DELETE) ---
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari URL (misal: /blogs/1/delete)

        // Hapus blog berdasarkan ID
        const result = await Blog.destroy({ where: { id: id } }); // Sequelize method untuk hapus berdasarkan kondisi

        // Kalau 0 baris dihapus (artinya ID tidak ditemukan)
        if (result === 0) {
            return res.status(404).json({ message: 'Blog tidak ditemukan' }); // 404 Not Found
        }

        // Sukses
        res.status(200).json({ message: 'Blog berhasil dihapus' }); // Kirim pesan sukses dalam bentuk JSON

    } catch (error) {
        console.error('Error deleting blog:', error); // Log error untuk debugging
        res.status(500).json({ message: 'Server Error: ' + error.message }); // Error handling
    }
};

// Ekspor semua fungsi agar bisa dipakai di file lain
module.exports = {
    getAllBlogs, // Export fungsi getAllBlogs
    createBlog, // Export fungsi createBlog
    getBlogById, // Export fungsi getBlogById
    updateBlog, // Export fungsi updateBlog
    deleteBlog, // Export fungsi deleteBlog
};
