// backend/src/models/reservationModel.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./userModel');
const Hotel = require('./hotelModel');
const CancellationRequest = require('./CancellationRequest'); // ✅ WAJIB

const Reservation = sequelize.define('Reservation', {
    check_in_date: DataTypes.DATEONLY,
    check_out_date: DataTypes.DATEONLY,
    total_price: DataTypes.FLOAT,
    original_price: DataTypes.FLOAT, // Store original price before discount
    discounted_price: DataTypes.FLOAT, // Store discounted price if applicable
    discount_percentage: DataTypes.FLOAT, // Store discount percentage

    // ✅ GANTI foreign key jadi konsisten
    hotelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'hotels', key: 'id' },
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
    },

    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'checked_in'),
        defaultValue: 'pending',
    },

    // New fields for number of rooms and guests
    number_of_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    number_of_guests: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    // Additional guest information
    guest_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    guest_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    guest_phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    special_request: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // Guest information fields
    guest_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    guest_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    guest_phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    special_request: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'reservations',
    timestamps: true,
});

// ✅ RELASI FIX
Reservation.belongsTo(Hotel, { foreignKey: 'hotelId' });
Hotel.hasMany(Reservation, { foreignKey: 'hotelId' });

Reservation.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Reservation, { foreignKey: 'userId' });

// ✅ RELASI CANCEL FIX
Reservation.hasMany(CancellationRequest, { foreignKey: 'reservationId' });
CancellationRequest.belongsTo(Reservation, { foreignKey: 'reservationId' });

module.exports = Reservation;
