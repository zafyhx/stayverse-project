// Jaring pengaman (Harusnya sudah ada dari tadi)
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 ERROR: Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('💥 ERROR: Uncaught Exception:', error);
    process.exit(1);
});
// ------------------------------------

require('dotenv').config();
const app = require('./src/app');
const { sequelize, connectDB } = require('./src/config/db');

// Import semua model
require('./src/models/hotelModel');
require('./src/models/userModel');
require('./src/models/reservationModel');
require('./src/models/Blog');
require('./src/models/CancellationRequest');
require('./src/models/index');

const PORT = process.env.PORT || 5001;

async function startServer() {
    try {
        // 1. Koneksi DB
        await connectDB();

        // 2. Sinkronisasi tabel
        await sequelize.sync({ alter: true });
        console.log('🧱 Database synchronized successfully!');

        // 3. Jalankan server (DENGAN CARA BARU)
        // Kita pakai 'new Promise' agar fungsi async ini "tertahan"
        // dan tidak selesai, yang memaksa server tetap hidup.
        await new Promise((resolve, reject) => {
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
            }).on('error', (err) => {
                // Ini untuk menangkap error kalau port 5001 sudah dipakai
                console.error('❌ Server listener error:', err);
                reject(err);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Mulai!
startServer();