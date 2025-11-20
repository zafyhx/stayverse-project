// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
// 1. Pastikan Paspampres di-import
const { protect, admin } = require('../middleware/authMiddleware');

const {
    registerUser,
    loginUser,
    getUsers,     // Harus di-import!
    updateUser,   // Harus di-import!
    deleteUser,   // Harus di-import!
    getProfile,   // Harus di-import!
    updateProfile // Harus di-import!
} = require('../controllers/userController');

// --- Rute Publik ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- RUTE PROTEKSI ADMIN ---
// 2. GET /api/users (List Semua User) ⬅️ INI YANG GAGAL DITEMUKAN SERVER
router.get('/', protect, admin, getUsers);

// PUT /api/users/:id (Edit user)
router.put('/:id', protect, admin, updateUser);

// DELETE /api/users/:id (Hapus user)
router.delete('/:id', protect, admin, deleteUser);

// --- RUTE PROTEKSI USER (untuk profile sendiri) ---
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
