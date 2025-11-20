const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, sequelize } = require('./config/db');

// Import Routes
const hotelRoutes = require('./routes/hotelRoutes');
const userRoutes = require('./routes/userRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cancellationRoutes = require('./routes/cancellationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ===========================
// 1. CONNECT DATABASE
// ===========================
connectDB();

// ===========================
// 2. CORS FIX — AMAN & BERSIH
// ===========================
const allowedOrigins = [
    "https://stayverse-68y9wtkkw-zafyhxs-projects.vercel.app", // Frontend Vercel
    "http://localhost:5173" // Dev mode Vite
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);  // Postman / server-to-server

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ CORS BLOCKED:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Fix OPTIONS (Express 5)
app.options("/*", cors());

// ===========================
// 3. MIDDLEWARE UMUM
// ===========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ===========================
// 4. ROUTES
// ===========================
app.use('/api/hotels', hotelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/cancellations', cancellationRoutes);
app.use('/api/admin', adminRoutes);

// ===========================
// 5. ROOT ROUTE (CEK SERVER + DB)
// ===========================
app.get('/', async (req, res) => {
    let dbStatus = 'Checking...';
    try {
        await sequelize.authenticate();
        dbStatus = '✅ Connected to Neon PostgreSQL';
    } catch (error) {
        dbStatus = `❌ Error: ${error.message}`;
    }

    res.status(200).json({
        server: '✅ Stayverse Backend Running',
        database: dbStatus,
        environment: process.env.NODE_ENV,
        timestamp: new Date()
    });
});

// ===========================
// 6. GLOBAL ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
    console.error('🔥 SERVER ERROR:', err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

module.exports = app;
