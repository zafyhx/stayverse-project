// src/pages/PublicDashboard.jsx
import { useState, useEffect } from 'react';
import { Building, Home, Umbrella, Building2 } from 'lucide-react';
import { getHotels, getPublicStats } from '../services/api';
import HotelCard from '../components/HotelCard';

function PublicDashboard() {
    const [hotels, setHotels] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch hotels first
                const hotelsResponse = await getHotels();
                setHotels(hotelsResponse.data);

                // Try to fetch stats, but don't fail if it doesn't work
                try {
                    const statsResponse = await getPublicStats();
                    setStats(statsResponse.data);
                } catch (statsErr) {
                    console.warn("Stats not available:", statsErr);
                    // Set default stats
                    setStats({
                        overview: { totalUsers: 0, totalHotels: hotelsResponse.data.length, totalReservations: 0 }
                    });
                }
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>Error: {error}</p>
                </div>
            </div>
        </div>
    );

    // Sample data for sections - Regular hotels without discounts
    const specialOffers = hotels.slice(0, 3);

    const accommodationTypes = [
        { type: 'Luxury Hotels', count: hotels.filter(h => h.price_per_night > 300).length, icon: <Building className="w-6 h-6 text-orange-500" /> },
        { type: 'Budget Stays', count: hotels.filter(h => h.price_per_night <= 150).length, icon: <Home className="w-6 h-6 text-orange-500" /> },
        { type: 'Resorts', count: hotels.filter(h => h.location.toLowerCase().includes('beach') || h.location.toLowerCase().includes('resort')).length, icon: <Umbrella className="w-6 h-6 text-orange-500" /> },
        { type: 'City Centers', count: hotels.filter(h => h.location.toLowerCase().includes('jakarta') || h.location.toLowerCase().includes('bali')).length, icon: <Building2 className="w-6 h-6 text-orange-500" /> }
    ];

    const popularDestinations = [
        { name: 'Bali', count: hotels.filter(h => h.location.toLowerCase().includes('bali')).length, image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=400&fit=crop&crop=center' },
        { name: 'Jakarta', count: hotels.filter(h => h.location.toLowerCase().includes('jakarta')).length, image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&h=400&fit=crop&crop=center' },
        { name: 'Yogyakarta', count: hotels.filter(h => h.location.toLowerCase().includes('yogyakarta')).length, image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=500&h=400&fit=crop&crop=center' },
        { name: 'Bandung', count: hotels.filter(h => h.location.toLowerCase().includes('bandung')).length, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=400&fit=crop&crop=center' }
    ];

    const topRated = hotels
        .sort((a, b) => b.available_rooms - a.available_rooms) // Sort by availability as proxy for popularity
        .slice(0, 4);

    return (
        <div className="pt-24 min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 py-20">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('/hero-background.jpg')`
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70"></div>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-orange-900/30"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                </div>
                <div className="relative container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Welcome to Stayverse
                    </h1>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
                        Discover amazing stays across Indonesia with world-class service and unforgettable experiences
                    </p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-white text-orange-600">
                            All Hotels
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-orange-700/50 text-orange-100 hover:bg-orange-700/70">
                            Luxury
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-orange-700/50 text-orange-100 hover:bg-orange-700/70">
                            Budget
                        </button>
                        <button className="px-4 py-2 rounded-full text-sm font-medium bg-orange-700/50 text-orange-100 hover:bg-orange-700/70">
                            Resorts
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.overview?.totalHotels || 0}</div>
                            <div className="text-orange-200 font-medium">Hotels Available</div>
                            <div className="w-12 h-1 bg-orange-300 mx-auto mt-4 rounded-full"></div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.overview?.totalUsers || 0}</div>
                            <div className="text-orange-200 font-medium">Happy Travelers</div>
                            <div className="w-12 h-1 bg-orange-300 mx-auto mt-4 rounded-full"></div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="text-4xl font-bold text-white mb-2">{stats?.overview?.totalReservations || 0}</div>
                            <div className="text-orange-200 font-medium">Bookings Made</div>
                            <div className="w-12 h-1 bg-orange-300 mx-auto mt-4 rounded-full"></div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center">
                        <button className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-lg">
                            Start Exploring →
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 py-12 space-y-16">
                {/* Featured Hotels */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Hotels</h2>
                        <p className="text-gray-600">Handpicked premium stays for your perfect getaway</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {specialOffers.map((hotel) => (
                            <div key={hotel.id} className="relative group">
                                <HotelCard hotel={hotel} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Explore by Accommodation Type */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Type</h2>
                        <p className="text-gray-600">Find the perfect accommodation for your needs</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {accommodationTypes.map((type, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
                                <div className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {type.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.type}</h3>
                                    <p className="text-sm text-gray-600 mb-4 font-medium">{type.count} options available</p>
                                    <div className="inline-flex items-center text-orange-600 font-semibold group-hover:translate-x-2 transition-transform">
                                        Explore
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Popular Destinations */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Destinations</h2>
                        <p className="text-gray-600">Discover the most sought-after locations in Indonesia</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularDestinations.map((dest, index) => (
                            <div key={index} className="relative group cursor-pointer">
                                <div className="aspect-w-16 aspect-h-12 rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h3 className="text-xl font-bold">{dest.name}</h3>
                                        <p className="text-sm text-gray-200 mb-3">{dest.count} hotels available</p>
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                                            Explore Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Rated Hotels */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Top Picks</h2>
                        <p className="text-gray-600">Handpicked hotels loved by our community</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {topRated.map((hotel) => (
                            <div key={hotel.id} className="relative">
                                <HotelCard hotel={hotel} />
                                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                    <span>⭐</span>
                                    <span className="ml-1">4.{Math.floor(Math.random() * 5) + 5}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-xl text-orange-100 mb-6">Join thousands of travelers who trust Stayverse for their perfect stay</p>
                    <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Browse All Hotels
                    </button>
                </section>
            </div>
        </div>
    );
}

export default PublicDashboard;
