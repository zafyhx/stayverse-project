const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db'); // Import fungsi koneksi

// Import Routes
const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cancellationRoutes = require('./routes/cancellationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- 0. PANGGIL KONEKSI DATABASE ---
// INI YANG KURANG DI KODE ANDA SEBELUMNYA!
connectDB(); 

// --- 1. KONFIGURASI CORS "ANTI-REWEL" ---
// Kita gunakan library cors tapi dengan trik Regex agar fleksibel
app.use(cors({
    // Regex ini berarti: "Izinkan semua domain yang diawali http atau https"
    origin: /^https?:\/\/.*$/, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true // Izinkan cookie/token lewat
}));

// Tangani Preflight Request (OPTIONS) secara eksplisit
app.options('*', cors());

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
    res.status(200).json({
        message: '✅ Server Stayverse Backend is RUNNING!',
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});

// --- 5. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('🔥 SERVER ERROR:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

module.exports = app;