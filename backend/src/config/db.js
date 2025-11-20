const { Sequelize } = require('sequelize');
const pg = require('pg'); // Wajib ada untuk Vercel
require('dotenv').config();

// Cek Environment
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        // ---------------------------------------------------------
        // KUNCI SUKSES VERCEL: dialectModule: pg
        // Tanpa baris ini, Vercel tidak bisa menemukan driver database
        // ---------------------------------------------------------
        dialectModule: pg, 
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: isProduction ? {
            ssl: {
                require: true,
                rejectUnauthorized: false // Wajib false untuk Neon/Render
            }
        } : {}
    }
);

// Fungsi koneksi yang harus dipanggil di app.js
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully (PostgreSQL/Neon)!');
        
        // Opsional: Sinkronisasi tabel (Hati-hati, alter:true bisa mengubah struktur DB)
        // await sequelize.sync({ alter: false }); 
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
};

module.exports = { sequelize, connectDB };