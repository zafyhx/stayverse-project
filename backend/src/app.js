const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, sequelize } = require('./config/db'); // Tambah sequelize untuk cek koneksi

// Import Routes
const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cancellationRoutes = require('./routes/cancellationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- 0. PANGGIL KONEKSI DATABASE ---
// Penting: Panggil ini agar server terhubung ke DB saat start
connectDB(); 

// --- 1. KONFIGURASI CORS (VERSI STABIL) ---
// Menggunakan Regex untuk mengizinkan frontend di vercel atau localhost
app.use(cors({
    origin: /^https?:\/\/.*$/, // Izinkan semua domain http/https
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// --- PERBAIKAN EXPRESS 5 ---
// Gunakan Regex /.*/ (tanpa tanda kutip) untuk menangani preflight request.
// Jangan gunakan '*' string karena akan error "Missing parameter name".
app.options(/.*/, cors());

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

// --- 4. ROUTE CEK SERVER & DATABASE ---
// Akses root url backend di browser untuk melihat status ini
app.get('/', async (req, res) => {
    let dbStatus = 'Checking...';
    try {
        await sequelize.authenticate();
        dbStatus = '✅ Connected to Neon PostgreSQL';
    } catch (error) {
        dbStatus = `❌ Error: ${error.message}`;
    }

    res.status(200).json({
        server: '✅ Server Stayverse Backend is RUNNING!',
        database: dbStatus,
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