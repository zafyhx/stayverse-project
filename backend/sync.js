require('dotenv').config();
const { sequelize } = require('./src/config/db');

// Import semua model agar terdaftar
require('./src/models/index'); 

async function syncDatabase() {
    try {
        console.log('⏳ Menghubungkan ke Database Neon...');
        await sequelize.authenticate();
        console.log('✅ Terhubung! Sedang membuat tabel...');

        // Perintah sakti untuk membuat tabel
        await sequelize.sync({ alter: true }); 

        console.log('🎉 SUKSES! Semua tabel (hotels, users, dll) sudah dibuat di Neon.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Gagal:', error);
        process.exit(1);
    }
}

syncDatabase();