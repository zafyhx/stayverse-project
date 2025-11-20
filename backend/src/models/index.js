// backend/src/models/index.js

const User = require('./userModel');
const Hotel = require('./hotelModel');
const Reservation = require('./reservationModel');
const CancellationRequest = require('./CancellationRequest'); // Asumsi nama file ini
const Blog = require('./Blog');

// Dengan me-require semua model di sini, kita memastikan asosiasi (belongsTo/hasMany) 
// yang ada di dalam setiap file model dieksekusi oleh Sequelize.

module.exports = {
    User,
    Hotel,
    Reservation,
    CancellationRequest,
    Blog
};