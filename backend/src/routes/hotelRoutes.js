// backend/src/routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware'); // 1. IMPORT PASPAMPES
const {
    getAllHotels,
    createHotel,
    getHotelById,
    deleteHotel,
    updateHotel
} = require('../controllers/hotelController');

// GET /api/hotels (Publik, Tidak dilindungi)
router.get('/', getAllHotels);

// GET /api/hotels/:id (Publik, Tidak dilindungi)
router.get('/:id', getHotelById);

// POST /api/hotels (HARUS ADMIN)
// 2. Pasang [protect, admin]. Satpam cek token dulu, baru Paspampres cek role.
router.post('/', protect, admin, createHotel);

// DELETE /api/hotels/:id (HARUS ADMIN)
router.delete('/:id', protect, admin, deleteHotel);

// PUT /api/hotels/:id (HARUS ADMIN)
router.put('/:id', protect, admin, updateHotel);

module.exports = router;