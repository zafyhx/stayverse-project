// backend/src/controllers/adminController.js
const { sequelize, Op } = require('../config/db');
const User = require('../models/userModel');
const Hotel = require('../models/hotelModel');
const Reservation = require('../models/reservationModel');
const CancellationRequest = require('../models/CancellationRequest');

const getDashboardStats = async (req, res) => {
    try {
        // 1. Ambil data mentah (hanya jumlah/count)
        const totalUsers = await User.count();
        const totalHotels = await Hotel.count();
        const totalReservations = await Reservation.count();
        const totalCancellations = await CancellationRequest.count({
            where: { status: 'approved' } // Hanya hitung yang disetujui
        });

        // 2. Get reservation status breakdown
        const reservationStatusBreakdown = await Reservation.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('status')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // 3. Kembalikan dalam bentuk JSON
        res.status(200).json({
            totalUsers,
            totalHotels,
            totalReservations,
            totalCancellations,
            reservationStatusBreakdown: reservationStatusBreakdown.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
        });

    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik.' });
    }
};

// --- FUNGSI BARU: Get Public Statistics (untuk dashboard publik) ---
const getPublicStats = async (req, res) => {
    try {
        // Get basic counts
        const totalUsers = await User.count();
        const totalHotels = await Hotel.count();
        const totalReservations = await Reservation.count();

        // Get reservation status breakdown
        const reservationStats = await Reservation.findAll({
            attributes: [
                'status',
                [Reservation.sequelize.fn('COUNT', Reservation.sequelize.col('status')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Get monthly reservation data for the last 12 months
        const monthlyData = await Reservation.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', '*'), 'reservations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '12 months'")
                }
            },
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });

        // Get monthly cancellation data for the last 12 months
        const monthlyCancellations = await CancellationRequest.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', '*'), 'cancellations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '12 months'")
                }
            },
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });

        // Get top 5 most booked hotels
        const topHotels = await Reservation.findAll({
            attributes: [
                'hotelId',
                [Reservation.sequelize.fn('COUNT', '*'), 'booking_count']
            ],
            include: [{
                model: Hotel,
                attributes: ['name', 'location']
            }],
            group: ['hotelId'],
            order: [[Reservation.sequelize.fn('COUNT', '*'), 'DESC']],
            limit: 5,
            raw: true
        });

        // Format the response
        const formattedStats = {
            overview: {
                totalUsers,
                totalHotels,
                totalReservations
            },
            reservationBreakdown: reservationStats.reduce((acc, stat) => {
                acc[stat.status] = parseInt(stat.count);
                return acc;
            }, {}),
            monthlyReservations: monthlyData.map(item => ({
                month: item.month,
                reservations: parseInt(item.reservations)
            })),
            monthlyCancellations: monthlyCancellations.map(item => ({
                month: item.month,
                cancellations: parseInt(item.cancellations)
            })),
            topHotels: topHotels.map(hotel => ({
                name: hotel['Hotel.name'],
                location: hotel['Hotel.location'],
                bookings: parseInt(hotel.booking_count)
            }))
        };

        res.status(200).json(formattedStats);

    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ message: 'Gagal mengambil data statistik publik.' });
    }
};

// --- FUNGSI BARU: Get Booking Logs (Recent Reservations) ---
const getBookingLogs = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [
                {
                    model: Hotel,
                    attributes: ['name', 'location']
                },
                {
                    model: User,
                    attributes: ['name', 'email']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 20, // Last 20 bookings
            attributes: ['id', 'status', 'check_in_date', 'check_out_date', 'total_price', 'createdAt', 'number_of_rooms', 'number_of_guests', 'guest_name', 'guest_email', 'guest_phone', 'special_request']
        });

        res.status(200).json(reservations);
    } catch (error) {
        console.error('Error fetching booking logs:', error);
        res.status(500).json({ message: 'Gagal mengambil log booking.' });
    }
};

// --- FUNGSI BARU: Get Cancellation Logs (All Cancellation Requests) ---
const getCancellationLogs = async (req, res) => {
    try {
        const cancellations = await CancellationRequest.findAll({
            include: [
                {
                    model: Reservation,
                    as: 'Reservation',
                    attributes: ['id', 'status', 'check_in_date', 'check_out_date', 'total_price'],
                    include: [
                        {
                            model: Hotel,
                            attributes: ['name', 'location']
                        },
                        {
                            model: User,
                            attributes: ['name', 'email']
                        }
                    ]
                }
            ],
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'reason', 'status', 'createdAt', 'updatedAt']
        });

        res.status(200).json(cancellations);
    } catch (error) {
        console.error('Error fetching cancellation logs:', error);
        res.status(500).json({ message: 'Gagal mengambil log pembatalan.' });
    }
};

// --- FUNGSI BARU: Get Chart Data for Dashboard ---
const getChartData = async (req, res) => {
    try {
        // Get monthly reservation data for the last 12 months
        const monthlyReservations = await Reservation.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', '*'), 'reservations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '12 months'")
                }
            },
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });

        // Get monthly cancellation data for the last 12 months
        const monthlyCancellations = await CancellationRequest.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('COUNT', '*'), 'cancellations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '12 months'")
                }
            },
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });

        // Get daily data for the last 30 days
        const dailyReservations = await Reservation.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', '*'), 'reservations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '30 days'")
                }
            },
            group: ['date'],
            order: [['date', 'ASC']],
            raw: true
        });

        // Get daily cancellations for the last 30 days
        const dailyCancellations = await CancellationRequest.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', '*'), 'cancellations']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '30 days'")
                }
            },
            group: ['date'],
            order: [['date', 'ASC']],
            raw: true
        });

        // Get revenue data (sum of total_price) for the last 12 months
        const monthlyRevenue = await Reservation.findAll({
            attributes: [
                [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
            ],
            where: {
                createdAt: {
                    [Op.gte]: sequelize.literal("NOW() - INTERVAL '12 months'")
                },
                status: 'confirmed' // Only count confirmed reservations for revenue
            },
            group: ['month'],
            order: [['month', 'ASC']],
            raw: true
        });

        res.status(200).json({
            monthlyReservations: monthlyReservations.map(item => ({
                month: item.month,
                reservations: parseInt(item.reservations)
            })),
            monthlyCancellations: monthlyCancellations.map(item => ({
                month: item.month,
                cancellations: parseInt(item.cancellations)
            })),
            dailyReservations: dailyReservations.map(item => ({
                date: item.date,
                reservations: parseInt(item.reservations)
            })),
            dailyCancellations: dailyCancellations.map(item => ({
                date: item.date,
                cancellations: parseInt(item.cancellations)
            })),
            monthlyRevenue: monthlyRevenue.map(item => ({
                month: item.month,
                revenue: parseFloat(item.revenue) || 0
            }))
        });

    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({ message: 'Gagal mengambil data chart.' });
    }
};

module.exports = {
    getDashboardStats,
    getPublicStats,
    getBookingLogs,
    getCancellationLogs,
    getChartData,
};
