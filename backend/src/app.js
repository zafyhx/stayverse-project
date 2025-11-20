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
app.use(cors({
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true
}));

// PENTING: Tangani request 'OPTIONS' (Preflight)
// PERBAIKAN V3: Menggunakan Regex /.*/ (tanpa tanda kutip) bukan string.
// Ini memaksa Express mencocokkan "apa saja" tanpa mempedulikan nama parameter.
app.options(/.*/, cors());

// --- 2. MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware statis
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- 3. ROUTING (JALUR DATA) ---
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
// PERBAIKAN V3: Gunakan app.use() tanpa path di akhir.
// Ini akan menangkap semua request yang lolos dari route di atasnya.
// Jauh lebih aman daripada menggunakan wildcard '*' atau regex di Express 5.
app.use((req, res, next) => {
    // Cek apakah ini error handler (punya 4 argumen) atau 404 handler
    // Jika sampai sini, berarti route tidak ketemu.
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