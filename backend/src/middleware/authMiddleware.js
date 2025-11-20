// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// --- Satpam LEVEL 1  ---
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ambil data user dari token (ini penting)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] }
            });

            // ✅ CRITICAL FIX: Ensure req.user is not null
            if (!req.user) {
                return res.status(401).json({ message: 'User tidak ditemukan' });
            }

            next(); // Lanjut ke Paspampres atau ke Controller
        } catch (error) {
            console.error('Auth error:', error);
            res.status(401).json({ message: 'Tidak terotorisasi, token gagal' });
        }
    } else {
        res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
    }
};

// --- Paspampres LEVEL 2  ---
const admin = (req, res, next) => {
    // Fungsi ini HARUS jalan SETELAH 'protect'
    // Jadi kita 100% punya 'req.user'

    if (req.user && req.user.role === 'admin') {
        // Role-nya 'admin'? Silakan lanjut.
        next();
    } else {
        // Bukan admin? Tendang.
        res.status(403).json({ message: 'Akses ditolak. Hanya untuk Admin.' }); // 403 = Forbidden
    }
};

module.exports = { protect, admin }; // Ekspor dua-duanya