// backend/src/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();

// 1. Import controller
const {
    createReservation,
    getMyReservations,
    checkInReservation
} = require('../controllers/reservationController');

// 2. Import "Bouncer"
const { protect } = require('../middleware/authMiddleware');

// 3. Definisikan rute POST
router.post('/', protect, createReservation);

// 4. Definisikan rute GET /mine
router.get('/mine', protect, getMyReservations);

// 5. Definisikan rute POST /check-in
router.post('/check-in', protect, checkInReservation);

module.exports = router;
