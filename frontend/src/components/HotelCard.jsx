// src/components/HotelCard.jsx
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

function HotelCard({ hotel }) {
    return (
        <Link to={`/hotel/${hotel.id}`} className="group h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Image Container - Fixed Height */}
                <div className="relative overflow-hidden h-48">
                    <img
                        src={hotel.imageUrl ? `http://localhost:5001${hotel.imageUrl}` : '/placeholder-hotel.jpg'}
                        alt={hotel.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="space-y-3">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors truncate leading-tight">
                            {hotel.name}
                        </h3>
                        <div className="flex flex-col space-y-1">
                            {hotel.discount_percentage > 0 ? (
                                <>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 whitespace-nowrap line-through">
                                        Rp{hotel.price_per_night?.toLocaleString()}/night
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 whitespace-nowrap">
                                        Rp{hotel.discounted_price?.toLocaleString()}/night ({hotel.discount_percentage}% OFF)
                                    </span>
                                </>
                            ) : (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 whitespace-nowrap">
                                    Rp{hotel.price_per_night?.toLocaleString()}/night
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {hotel.location}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                {hotel.available_rooms} rooms available
                            </div>
                            <span className="text-orange-500 group-hover:translate-x-2 transition-transform duration-300">
                                View Details →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}


export default HotelCard
