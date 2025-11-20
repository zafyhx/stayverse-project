// backend/src/controllers/cancellationController.js
const { sequelize } = require('../config/db');
const CancellationRequest = require('../models/CancellationRequest');
const Reservation = require('../models/reservationModel');
const Hotel = require('../models/hotelModel');

// --- FUNGSI 1: USER REQUEST CANCELLATION (POST) ---
const requestCancellation = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { reservationId, reason } = req.body;

        const reservation = await Reservation.findByPk(reservationId, { transaction: t });

        if (!reservation || reservation.status !== 'confirmed') {
            await t.rollback();
            return res.status(404).json({
                message: 'Reservasi tidak dapat diajukan pembatalan (Status bukan Confirmed).'
            });
        }

        const newRequest = await CancellationRequest.create({
            reservationId: reservation.id,
            reason,
            status: 'pending',
        }, { transaction: t });

        await reservation.update({ status: 'pending' }, { transaction: t });

        await t.commit();
        res.status(201).json(newRequest);

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Gagal mengajukan pembatalan.' });
    }
};


// --- FUNGSI 2: ADMIN GET ALL PENDING REQUESTS (GET) ---
const getCancellationRequests = async (req, res) => {
    try {
        const requests = await CancellationRequest.findAll({
            where: { status: 'pending' },
            include: [{
                model: Reservation,
                as: 'Reservation',
                attributes: [
                    'id',
                    'status',
                    'check_in_date',      // ✅ FIX
                    'check_out_date',     // ✅ FIX
                    'userId',             // ✅ FIX
                    'hotelId'             // ✅ FIX
                ],
                include: [{
                    model: Hotel,
                    attributes: ['id', 'name', 'location']
                }]
            }],
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json(requests);

    } catch (error) {
        console.error("Gagal memuat pengajuan:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};


// --- FUNGSI 3: ADMIN UPDATE STATUS (PUT) ---
const updateRequestStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;

        const request = await CancellationRequest.findByPk(id, {
            include: [{
                model: Reservation,
                as: 'Reservation'
            }],
            transaction: t
        });

        if (!request) {
            await t.rollback();
            return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
        }

        request.status = status;
        await request.save({ transaction: t });

        if (status === 'approved') {
            await Reservation.update(
                { status: 'cancelled' },
                { where: { id: request.Reservation.id }, transaction: t }
            );
        }

        await t.commit();
        res.status(200).json(request);

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: 'Gagal mengubah status pembatalan.', error });
    }
};


// --- FUNGSI 4: ADMIN DELETE REQUEST (DELETE) ---
const deleteCancellationRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CancellationRequest.destroy({ where: { id } });

        if (result === 0) {
            return res.status(404).json({ message: 'Pengajuan tidak ditemukan.' });
        }

        res.status(200).json({ message: 'Pengajuan berhasil dihapus.' });

    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus pengajuan.', error });
    }
};


// --- FUNGSI BARU: Get My Cancellation Requests (for users to see their own requests) ---
const getMyCancellationRequests = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming auth middleware sets req.user

        const requests = await CancellationRequest.findAll({
            where: { '$Reservation.userId$': userId }, // Filter by user's reservations
            include: [{
                model: Reservation,
                as: 'Reservation',
                attributes: ['id', 'status', 'check_in_date', 'check_out_date', 'total_price'],
                include: [{
                    model: Hotel,
                    attributes: ['name', 'location']
                }]
            }],
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'reason', 'status', 'createdAt', 'updatedAt']
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error('Error fetching my cancellation requests:', error);
        res.status(500).json({ message: 'Gagal mengambil pengajuan pembatalan Anda.' });
    }
};

module.exports = {
    requestCancellation,
    getCancellationRequests,
    updateRequestStatus,
    deleteCancellationRequest,
    getMyCancellationRequests,
};
