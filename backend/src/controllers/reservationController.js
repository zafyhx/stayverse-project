// backend/src/controllers/reservationController.js
const Reservation = require('../models/reservationModel');
const Hotel = require('../models/hotelModel');
const { sequelize } = require('../config/db');

// ✅ 1. CREATE RESERVATION
const createReservation = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { hotelId, check_in_date, check_out_date, total_price, original_price, discounted_price, discount_percentage, number_of_rooms, number_of_guests, guest_name, guest_email, guest_phone, special_request } = req.body;
        const userId = req.user.id; // ✅ ambil userId dari token

        // ✅ Cek apakah hotel ada
        const hotel = await Hotel.findByPk(hotelId, { transaction: t });
        if (!hotel) {
            await t.rollback();
            return res.status(404).json({ message: 'Hotel tidak ditemukan' });
        }

        // ✅ Cek ketersediaan kamar
        if (hotel.available_rooms < number_of_rooms) {
            await t.rollback();
            return res.status(400).json({ message: 'Kamar hotel tidak cukup tersedia' });
        }

        // ✅ FIX UTAMA — pakai foreignKey lowercase
        const newReservation = await Reservation.create({
            userId,        // ✅ lowercase
            hotelId,       // ✅ lowercase
            check_in_date,
            check_out_date,
            total_price,
            original_price,
            discounted_price,
            discount_percentage,
            number_of_rooms,
            number_of_guests,
            guest_name,
            guest_email,
            guest_phone,
            special_request,
            status: 'confirmed',
        }, { transaction: t });

        // ✅ Kurangi kamar tersedia
        hotel.available_rooms -= number_of_rooms;
        await hotel.save({ transaction: t });

        await t.commit();
        res.status(201).json(newReservation);

    } catch (error) {
        await t.rollback();
        console.error('Error creating reservation:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// ✅ 2. GET MY RESERVATIONS
const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            where: { userId: req.user.id }, // ✅ lowercase
            include: [Hotel],               // ✅ akan otomatis pakai FK hotelId
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- FUNGSI BARU: Check-in Reservation ---
const checkInReservation = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const userId = req.user.id;

        // Find the reservation
        const reservation = await Reservation.findOne({
            where: {
                id: reservationId,
                userId: userId,
                status: 'confirmed'
            },
            include: [Hotel]
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservasi tidak ditemukan atau tidak dapat di-check-in' });
        }

        // Check if check-in date is today or in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkInDate = new Date(reservation.check_in_date);

        if (checkInDate > today) {
            return res.status(400).json({ message: 'Check-in hanya dapat dilakukan pada tanggal check-in atau setelahnya' });
        }

        // Update reservation status to checked_in
        reservation.status = 'checked_in';
        await reservation.save();

        res.status(200).json({
            message: 'Check-in berhasil!',
            reservation: {
                id: reservation.id,
                hotelName: reservation.Hotel.name,
                check_in_date: reservation.check_in_date,
                check_out_date: reservation.check_out_date,
                status: reservation.status
            }
        });

    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    createReservation,
    getMyReservations,
    checkInReservation,
};
