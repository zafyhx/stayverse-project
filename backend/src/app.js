const express = require('express');
const path = require('path');

// Import Routes
const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cancellationRoutes = require('./routes/cancellationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- 1. KONFIGURASI CORS MANUAL (SUPER KUAT) ---
// Kita atur header izin secara manual agar tidak ada penolakan.
app.use((req, res, next) => {
    // Izinkan Siapapun (*) mengakses
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");

    // Jika browser minta izin (Preflight Check), langsung bilang OK (200)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 3. ROUTING ---
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api/admin', adminRoutes);

// --- 4. ROUTE CEK SERVER ---
app.get('/', (req, res) => {
    res.send('✅ Server Stayverse Backend is RUNNING & CORS ENABLED!');
});

// --- 5. ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('🔥 SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Terjadi kesalahan pada server',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

module.exports = app;