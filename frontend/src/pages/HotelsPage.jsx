// src/pages/HotelsPage.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Briefcase, Users, Backpack } from 'lucide-react';
import { getHotels } from '../services/api';
import HotelCard from '../components/HotelCard';

function HotelsPage() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams, setSearchParams] = useState({
        location: '',
        checkIn: '',
        checkOut: '',
        guests: 1
    });

    const fetchHotels = async (params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getHotels(params);
            setHotels(response.data);
        } catch (err) {
            setError(err.message || "Gagal fetch hotel");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchHotels(searchParams);
    };

    const handleInputChange = (e) => {
        setSearchParams({
            ...searchParams,
            [e.target.name]: e.target.value
        });
    };

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Business Traveler",
            content: "Stayverse made my business trips so much easier. The hotels are always top-notch and the booking process is seamless.",
            rating: 5,
            avatar: <Briefcase className="w-8 h-8 text-orange-500" />
        },
        {
            name: "Mike Chen",
            role: "Family Vacationer",
            content: "Perfect for family trips! Found amazing family-friendly hotels with great amenities for the kids.",
            rating: 5,
            avatar: <Users className="w-8 h-8 text-orange-500" />
        },
        {
            name: "Emma Davis",
            role: "Solo Traveler",
            content: "As a solo female traveler, I feel safe and comfortable with Stayverse's verified properties.",
            rating: 5,
            avatar: <Backpack className="w-8 h-8 text-orange-500" />
        }
    ];

    const stats = [
        { number: "50K+", label: "Happy Customers" },
        { number: "1000+", label: "Hotels Worldwide" },
        { number: "4.8", label: "Average Rating" },
        { number: "24/7", label: "Customer Support" }
    ];

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
                        Discover Amazing Hotels
                    </h1>
                    <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
                        Find your perfect stay from our curated collection of premium hotels worldwide
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={searchParams.location}
                                    onChange={handleInputChange}
                                    placeholder="Where are you going?"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                                <input
                                    type="date"
                                    name="checkIn"
                                    value={searchParams.checkIn}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                                <input
                                    type="date"
                                    name="checkOut"
                                    value={searchParams.checkOut}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                                <select
                                    name="guests"
                                    value={searchParams.guests}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                        >
                            Search Hotels
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20 py-12 space-y-16">
                {/* Stats Section */}
                <section className="bg-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Hotels Grid */}
                <section>
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Available Hotels
                            <div className="h-1 w-20 bg-orange-500 mt-2"></div>
                        </h2>
                        <div className="text-gray-600">
                            {hotels.length} hotels found
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white h-[400px] rounded-xl shadow-lg"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 text-lg mb-4">Error: {error}</div>
                            <button
                                onClick={() => fetchHotels()}
                                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hotels.map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Testimonials Section */}
                <section className="bg-white">
                    <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
                        What Our Guests Say
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="mr-4">{testimonial.avatar}</div>
                                    <div>
                                        <div className="text-xl font-semibold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">⭐</span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 italic">"{testimonial.content}"</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-gradient-to-r from-orange-500 to-blue-600 rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Book Your Perfect Stay?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of satisfied travelers who trust Stayverse for their accommodation needs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                            Start Booking Now
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default HotelsPage;
