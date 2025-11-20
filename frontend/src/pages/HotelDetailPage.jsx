// src/pages/HotelDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHotelById } from '../services/api';

function HotelDetailPage() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                setLoading(true);
                const response = await getHotelById(id);
                setHotel(response.data);
            } catch (err) {
                setError(err.message);
                console.error("Gagal fetch detail hotel:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    if (loading) {
        return <div className="text-center py-12 text-gray-600">Loading detail hotel...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">Error: {error}</div>;
    }

    if (!hotel) {
        return <div className="text-center py-12 text-gray-600">Hotel tidak ditemukan.</div>;
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            {/* Image Gallery */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={hotel?.imageUrl ? `http://localhost:5001${hotel.imageUrl}` : '/placeholder-hotel.jpg'}
                    alt={hotel?.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="container mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{hotel?.name}</h1>
                        <p className="text-xl text-gray-200 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            {hotel?.location}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">About this hotel</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {hotel?.description}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Amenities list */}
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        {hotel?.discount_percentage > 0 ? (
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-2xl font-bold text-gray-500 line-through">
                                                    Rp{hotel?.price_per_night?.toLocaleString()}
                                                </span>
                                                <span className="text-3xl font-bold text-green-600">
                                                    Rp{hotel?.discounted_price?.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-green-600 font-medium">
                                                    ({hotel?.discount_percentage}% OFF)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-3xl font-bold text-gray-900">
                                                Rp{hotel?.price_per_night?.toLocaleString()}
                                            </span>
                                        )}
                                        <span className="text-gray-600">/night</span>
                                    </div>
                                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {hotel?.available_rooms} rooms left
                                    </span>
                                </div>

                                <Link
                                    to={`/book-hotel/${hotel?.id}`}
                                    className="block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 
                                        text-white text-center rounded-lg font-medium transition-colors"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelDetailPage;
