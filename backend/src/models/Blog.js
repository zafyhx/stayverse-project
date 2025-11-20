// backend/src/models/Blog.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Blog = sequelize.define('Blog', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT, // Pakai TEXT untuk isi artikel yang panjang
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: 'Admin', // Default penulis
    },
    imageUrl: {
        type: DataTypes.STRING, // Link gambar header
        defaultValue: 'https://via.placeholder.com/800x400.png?text=Blog+Image',
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Travel Tips',
    },
}, {
    tableName: 'blogs',
    timestamps: true,
});

module.exports = Blog;