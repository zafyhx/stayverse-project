const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get } = require('../routes/hotelRoutes');

// --- FUNGSI 1: Registrasi User Baru (POST) ---
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Cek input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' });
        }

        // 2. Cek jika email sudah terdaftar
        const userExists = await User.findOne({ where: { email: email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        // 3. Enkripsi password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Buat user baru di database
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Default role 'user' jika tidak diisi
        });

        // 5. Kirim respon (tanpa password)
        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- FUNGSI 2: Login User (BARU) ---
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cek input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi.' });
        }

        // 2. Cari user berdasarkan email
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ message: 'Kredensial tidak valid' }); // 401 = Unauthorized
        }

        // 3. Bandingkan password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Kredensial tidak valid' });
        }

        // 4. Buat Token (Tiket Masuk)
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Data yang disimpan di token
            process.env.JWT_SECRET,           // Kunci rahasia dari .env
            { expiresIn: '1h' }                // Token hangus dalam 1 jam
        );

        // 5. Kirim balasan sukses
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token, // Kirim token-nya ke user
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

//--- FUNGSI 3: Ambil semua user (GET /api/users) ---//
const getUsers = async (req, res) => {
    try {
        // Cari semua user, tapi jangan sertakan password!
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

//--- FUNGSI 4: Update User (PUT /api/users/:id) ---//
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        // Kirim balasan tanpa password
        res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

//--- FUNGSI 5: Hapus User (DELETE /api/users/:id) ---//
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.destroy({ where: { id: id } });

        if (result === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

        res.status(200).json({ message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

//--- FUNGSI 6: Get Profile (GET /api/users/profile) ---//
const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

//--- FUNGSI 7: Update Profile (PUT /api/users/profile) ---//
const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ where: { email: email } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email sudah digunakan' });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();

        // Return updated user without password
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile
};
