// src/pages/admin/HotelListAdmin.jsx
import { useState, useEffect } from 'react';
import { getHotels, deleteHotel } from '../../services/api';
import { Link } from 'react-router-dom';

function HotelListAdmin() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchHotels = async () => {
        try {
            // Interceptor otomatis nempelin token, jadi aman!
            const response = await getHotels();
            setHotels(response.data);
        } catch (err) {
            // Di sini bisa error 403 kalau token Admin-nya expired
            setError('Gagal mengambil data hotel. Token mungkin expired.');
            console.error("Fetch Hotel Admin Gagal:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleDelete = async (id, name) => {
        if (window.confirm(`Yakin ingin menghapus hotel: ${name}?`)) {
            try {
                await deleteHotel(id); // Panggil API
                alert(`Hotel '${name}' berhasil dihapus.`);
                fetchHotels(); // Refresh list setelah dihapus
            } catch (err) {
                alert('Gagal menghapus hotel. Cek konsol.');
                console.error("Delete Hotel Gagal:", err);
            }
        }
    };

    if (loading) return <div className="text-center py-12 text-gray-600">Memuat data hotel untuk Admin...</div>;
    if (error) return <div className="text-center py-12 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Hotel</h2>
                <Link
                    to="/admin/hotels/add"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg 
                        hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg 
                        hover:shadow-blue-500/30"
                >
                    + Tambah Hotel Baru
                </Link>
            </div>

            <div className="grid gap-4">
                {hotels.map(hotel => (
                    <div key={hotel.id}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6">
                        <div className="flex gap-4">
                            {/* Hotel Image */}
                            {hotel.imageUrl && (
                                <div className="flex-shrink-0">
                                    <img 
                                        src={hotel.imageUrl.startsWith('http') ? hotel.imageUrl : `http://localhost:5001${hotel.imageUrl}`}
                                        alt={hotel.name}
                                        className="w-32 h-32 object-cover rounded-lg bg-gray-200"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}

                            {/* Hotel Info */}
                            <div className="flex-1 flex justify-between items-center">
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-gray-800">{hotel.name}</h3>
                                    <p className="text-gray-500">{hotel.location}</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="text-blue-600 font-medium">
                                            Rp{hotel.price_per_night?.toLocaleString()}/night
                                        </span>
                                        <span className="text-gray-500">
                                            {hotel.available_rooms} rooms available
                                        </span>
                                    </div>
                                    {hotel.discount_percentage > 0 && (
                                        <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                            {hotel.discount_percentage}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to={`/admin/hotels/edit/${hotel.id}`}
                                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(hotel.id, hotel.name)}
                                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HotelListAdmin;
