// backend/src/models/CancellationRequest.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const CancellationRequest = sequelize.define('CancellationRequest', {
    reservationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reservations', key: 'id' },
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
    },
}, {
    tableName: 'cancellation_requests',
    timestamps: true,
});

module.exports = CancellationRequest;
