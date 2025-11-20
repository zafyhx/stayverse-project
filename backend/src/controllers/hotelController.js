// Import model Hotel yang sudah kita buat
const Hotel = require('../models/hotelModel');

// --- Fungsi 1: Ambil SEMUA hotel (GET) ---
const getAllHotels = async (req, res) => {
    try {
        // 1. Ambil query dari URL (misal: /hotels?location=Jakarta)
        const { location, maxPrice } = req.query;

        // 2. Siapkan "saringan" (filter)
        const whereClause = {};
        const { Op } = require('sequelize');

        if (location) {
            // 3. Kalau ada query 'location', tambahkan ke saringan dengan case-insensitive search
            whereClause.location = { [Op.iLike]: `%${location}%` };
        }

        if (maxPrice) {
            // 4. Kalau ada query 'maxPrice', saring harga
            whereClause.price_per_night = { [Op.lte]: parseFloat(maxPrice) };
        }

        // 5. Cari hotel berdasarkan "saringan".
        //    Kalau 'whereClause' kosong, dia akan ambil SEMUA.
        const hotels = await Hotel.findAll({ where: whereClause });

        res.status(200).json(hotels);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- Fungsi 2: Buat hotel BARU (POST) ---
const createHotel = async (req, res) => {
    try {
        // Ambil data (name, location, dll) dari body request
        // Ini nanti kita kirim pakai Postman
        const { name, location, description, price_per_night, available_rooms, discount_percentage } = req.body;

        // Validasi input sederhana
        if (!name || !location || !price_per_night || !available_rooms) {
            return res.status(400).json({ message: 'Input tidak lengkap. Nama, lokasi, harga, dan jumlah kamar wajib diisi.' });
        }

        // Hitung discounted_price jika ada discount_percentage
        let discounted_price = null;
        if (discount_percentage && discount_percentage > 0) {
            discounted_price = price_per_night * (1 - discount_percentage / 100);
        }

        // Handle image upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/hotels/${req.file.filename}`;
        }

        // Perintah Sequelize: "INSERT INTO hotels (....) VALUES (....)"
        const newHotel = await Hotel.create({
            name,
            location,
            description,
            price_per_night,
            available_rooms,
            discount_percentage: discount_percentage || 0,
            discounted_price,
            imageUrl,
        });

        // Kirim balasan sukses (201 = Created) dengan data hotel yang baru dibuat
        res.status(201).json(newHotel);

    } catch (error) {
        // Kalau gagal (misal validasi Sequelize error), kirim balasan 500
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- FUNGSI 3: Ambil SATU hotel (BARU) ---
const getHotelById = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari URL (misal: /hotels/1)

        // 1. Cari hotel berdasarkan Primary Key (ID)
        const hotel = await Hotel.findByPk(id);

        // 2. Kalau hotel-nya nggak ada
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel tidak ditemukan' });
        }

        // 3. Kalau ada, kirim datanya
        res.status(200).json(hotel);

    } catch (error) {
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- FUNGSI 4: Hapus Hotel (DELETE) ---
const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID dari URL

        // 1. Cek apakah hotelnya ada
        const result = await Hotel.destroy({
            where: { id: id },
        });

        // 2. Kalau 0 baris dihapus
        if (result === 0) {
            return res.status(404).json({ message: 'Hotel tidak ditemukan' });
        }

        // 3. Sukses
        res.status(200).json({ message: 'Hotel berhasil dihapus' });

    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// --- FUNGSI 5: Update Hotel (PUT) ---
const updateHotel = async (req, res) => {
    try {
        const { id } = req.params; // ID yang mau di-edit
        const { name, location, description, price_per_night, available_rooms, discount_percentage } = req.body;

        // 1. Cari hotelnya
        const hotel = await Hotel.findByPk(id);

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel tidak ditemukan' });
        }

        // 2. Update field-fieldnya
        hotel.name = name || hotel.name;
        hotel.location = location || hotel.location;
        hotel.description = description || hotel.description;
        hotel.price_per_night = price_per_night || hotel.price_per_night;
        hotel.available_rooms = available_rooms || hotel.available_rooms;
        hotel.discount_percentage = discount_percentage !== undefined ? discount_percentage : hotel.discount_percentage;

        // Handle image upload - only update if new file is provided
        if (req.file) {
            hotel.imageUrl = `/uploads/hotels/${req.file.filename}`;
        }

        // Hitung ulang discounted_price jika discount_percentage berubah
        if (hotel.discount_percentage > 0) {
            hotel.discounted_price = hotel.price_per_night * (1 - hotel.discount_percentage / 100);
        } else {
            hotel.discounted_price = null;
        }

        // 3. Simpan perubahan
        await hotel.save();

        res.status(200).json(hotel); // Kirim data hotel yang sudah di-update

    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// Ekspor semua fungsi agar bisa dipakai di file lain
module.exports = {
    getAllHotels,
    createHotel,
    updateHotel,
    getHotelById,
    deleteHotel,
};