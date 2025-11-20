import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const HotelForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Untuk edit mode
    const isEdit = !!id; // Jika ada id, berarti edit mode

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        price_per_night: '',
        available_rooms: '',
        discount_percentage: 0,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load data hotel jika edit mode
    useEffect(() => {
        if (isEdit) {
            const fetchHotel = async () => {
                try {
                    const response = await api.get(`/admin/hotels/${id}`);
                    const hotel = response.data;
                    setFormData({
                        name: hotel.name || '',
                        location: hotel.location || '',
                        description: hotel.description || '',
                        price_per_night: hotel.price_per_night || '',
                        available_rooms: hotel.available_rooms || '',
                        discount_percentage: hotel.discount_percentage || 0,
                    });
                    if (hotel.imageUrl) {
                        setImagePreview(hotel.imageUrl.startsWith('http') ? hotel.imageUrl : `http://localhost:5001${hotel.imageUrl}`);
                    }
                } catch (err) {
                    setError('Gagal memuat data hotel');
                    console.error('Error fetching hotel:', err);
                }
            };
            fetchHotel();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('location', formData.location);
            submitData.append('description', formData.description);
            submitData.append('price_per_night', formData.price_per_night);
            submitData.append('available_rooms', formData.available_rooms);
            submitData.append('discount_percentage', formData.discount_percentage);
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (isEdit) {
                await api.put(`/admin/hotels/${id}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await api.post('/admin/hotels', submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            navigate('/admin/hotels'); // Redirect ke list hotel
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan');
            console.error('Error saving hotel:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">
                {isEdit ? 'Edit Hotel' : 'Tambah Hotel Baru'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Hotel
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan nama hotel"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lokasi
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan lokasi hotel"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Deskripsi
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan deskripsi hotel"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Harga per Malam
                        </label>
                        <input
                            type="number"
                            name="price_per_night"
                            value={formData.price_per_night}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Jumlah Kamar Tersedia
                        </label>
                        <input
                            type="number"
                            name="available_rooms"
                            value={formData.available_rooms}
                            onChange={handleChange}
                            required
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Diskon (%)
                    </label>
                    <input
                        type="number"
                        name="discount_percentage"
                        value={formData.discount_percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gambar Hotel
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imagePreview && (
                        <img src={imagePreview} alt="Preview" className="mt-2 rounded-lg h-48 object-cover" />
                    )}
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Menyimpan...' : (isEdit ? 'Update Hotel' : 'Tambah Hotel')}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/admin/hotels')}
                        className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HotelForm;
