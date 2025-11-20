// src/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Jangan log setiap query SQL
        pool: { // Tambahkan pool koneksi
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 60000
        }
    }
);

// BUAT FUNGSI BARU UNTUK CONNECT
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1); // PAKSA MATI JIKA GAGAL KONEK
    }
};

// Ekspor sequelize DAN fungsi connectDB
module.exports = { sequelize, connectDB, Op: Sequelize.Op };
