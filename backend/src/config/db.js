// src/config/db.js
const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

// Cek apakah kita sedang di mode production (Cloud) atau development (Laptop)
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectModule: pg,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 60000
        },
        // TAMBAHAN PENTING UNTUK CLOUD (RENDER/NEON):
        dialectOptions: isProduction ? {
            ssl: {
                require: true,
                rejectUnauthorized: false // Wajib false untuk koneksi Cloud gratisan
            }
        } : {}
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error(error);
    }
};

module.exports = { sequelize, connectDB, Op: Sequelize.Op };