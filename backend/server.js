require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectDB } = require('./src/config/db');

// Import semua model (Biarkan seperti semula)
require('./src/models/hotelModel');
require('./src/models/userModel');
require('./src/models/reservationModel');
require('./src/models/Blog');
require('./src/models/CancellationRequest');
require('./src/models/index');

const PORT = process.env.PORT || 5001;

// --- LOGIKA UTAMA (PERUBAHAN PENTING) ---

// 1. Kita jalankan koneksi database
// Catatan: Di Vercel, kita tidak pakai 'await' di top-level untuk menghindari timeout startup.
// Kita biarkan dia connect secara asinkronus.
connectDB().then(() => {
    // Hanya sync tabel jika DI LAPTOP (Development)
    // Di Vercel (Production), sync otomatis itu berbahaya & lambat, sebaiknya dimatikan
    // atau dijalankan manual lewat seed.js jika perlu update tabel.
    if (process.env.NODE_ENV !== 'production') {
        sequelize.sync({ alter: true })
            .then(() => console.log('🧱 Database synchronized (Dev Mode)!'))
            .catch(err => console.error('❌ Sync error:', err));
    }
});

// 2. Cek: Apakah kita di Vercel (Production) atau Laptop?
if (process.env.NODE_ENV !== 'production') {
    // === MODE LAPTOP ===
    // Kita jalankan server manual pakai app.listen
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
}

// 3. === MODE VERCEL ===
// INI YANG DICARI VERCEL!
// Kita harus meng-export 'app' agar Vercel bisa mengambil alih.
module.exports = app;