// backend/src/routes/cancellationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
    requestCancellation,
    getCancellationRequests,
    updateRequestStatus,
    deleteCancellationRequest,
    getMyCancellationRequests
} = require('../controllers/cancellationController');

// POST /api/cancellations (User mengajukan) - Wajib Login
router.post('/', protect, requestCancellation);

// GET /api/cancellations (Admin melihat list) - Wajib Admin
router.get('/', protect, admin, getCancellationRequests);

// PUT /api/cancellations/:id (Admin setuju/tolak) - Wajib Admin
router.put('/:id', protect, admin, updateRequestStatus);

// ⬅️ DELETE /api/cancellations/:id (Admin Hapus) ⬅️
router.delete('/:id', protect, admin, deleteCancellationRequest);

// GET /api/cancellations/my (User melihat pengajuan sendiri) - Wajib Login
router.get('/my', protect, getMyCancellationRequests);

module.exports = router;
