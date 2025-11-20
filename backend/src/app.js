const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Routes
const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cancellationRoutes = require('./routes/cancellationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- 1. KONFIGURASI CORS (SATPAM PINTU) ---
// Kita izinkan SEMUA origin, SEMUA method, dan SEMUA header.
app.use(cors({
    origin: true, // 'true' artinya izinkan siapapun yang merequest
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// PENTING: Tangani request 'OPTIONS' (Preflight) secara eksplisit
// PERBAIKAN EXPRESS 5: Mengganti '*' dengan '(.*)'
app.options('(.*)', cors());

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware statis untuk akses gambar (Hanya jalan jika folder ada)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 3. ROUTING (JALUR DATA) ---
// Pastikan prefix-nya '/api' agar cocok dengan Frontend
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api/admin', adminRoutes);

// --- 4. ROUTE PENGECEKAN (TEST) ---
app.get('/', (req, res) => {
    res.send('✅ Server Stayverse Backend is RUNNING!');
});

// --- 5. PENANGANAN RUTE TIDAK DITEMUKAN (404) ---
// PERBAIKAN EXPRESS 5: Gunakan '(.*)' untuk menangkap rute nyasar
app.all('(.*)', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found on this server!`
    });
});

// --- 6. GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
    console.error('🔥 SERVER ERROR:', err.stack);
    res.status(500).json({
        message: 'Terjadi kesalahan pada server',
        error: process.env.NODE_ENV === 'production' ? {} : err.message
    });
});

module.exports = app;