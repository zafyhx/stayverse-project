// src/models/hotelModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Hotel = sequelize.define('Hotel', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price_per_night: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    available_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    discounted_price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tableName: 'hotels',
    timestamps: true,
});

module.exports = Hotel;
