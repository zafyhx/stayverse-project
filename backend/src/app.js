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
// 2. CORS FIX — AMAN UNTUK VERCEL
// ===========================
const allowedOrigins = [
    "https://stayverse-68y9wtkkw-zafyhxs-projects.vercel.app",
    "http://localhost:5173"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("❌ CORS BLOCKED:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// FIX OPTIONS (Express 5)
// TIDAK BOLEH PAKAI "/*"
app.options("*", cors());

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
// 5. ROOT ROUTE
// ===========================
app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.json({
            server: "Stayverse Backend Running",
            database: "Connected to Neon PostgreSQL",
            timestamp: new Date()
        });
    } catch (error) {
        res.json({
            server: "Running",
            database: "Connection failed",
            error: error.message
        });
    }
});

// ===========================
// 6. GLOBAL ERROR HANDLER
// ===========================
app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
        detail: err.message
    });
});

module.exports = app;
