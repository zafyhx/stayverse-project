import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, Sofa, Smile } from 'lucide-react';
import Hero from '../components/Hero';
import HotelCard from '../components/HotelCard';
import { getHotels, getBlogPosts } from '../services/api';

function HomePage() {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHotels = async (searchParams = {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getHotels(searchParams);
            setHotels(response.data);
        } catch (err) {
            setError(err.message || "Gagal fetch hotel");
        } finally {
            setLoading(false);
        }
    };

    const fetchBlogs = async () => {
        try {
            const response = await getBlogPosts();
            setBlogs(response.data.slice(0, 3)); // Show only first 3 blogs
        } catch (err) {
            console.error("Failed to fetch blogs:", err);
        }
    };

    useEffect(() => {
        fetchHotels();
        fetchBlogs();
    }, []);

    const handleSearch = (searchParams) => {
        fetchHotels(searchParams);
    };

    const features = [
        {
            title: "Best Value",
            description: "We offer the best value for money with our hotel options.",
            icon: <DollarSign className="w-8 h-8 text-white" />
        },
        {
            title: "Modern Amenities",
            description: "Our hotels come with modern amenities for a comfortable stay.",
            icon: <Sofa className="w-8 h-8 text-white" />
        },
        {
            title: "Excellent Service",
            description: "Our staff provides excellent service.",
            icon: <Smile className="w-8 h-8 text-white" />
        }
    ];

    const destinations = [
        {
            name: "Bali",
            image: "/images/destinations/bali.jpg",
            description: "Island of the Gods with stunning beaches and culture",
            hotels: hotels.filter(h => h.location.toLowerCase().includes('bali')).length,
            location: "bali"
        },
        {
            name: "Jakarta",
            image: "/images/destinations/jakarta.jpg",
            description: "Bustling capital city with modern attractions",
            hotels: hotels.filter(h => h.location.toLowerCase().includes('jakarta')).length,
            location: "jakarta"
        },
        {
            name: "Yogyakarta",
            image: "/images/destinations/yogyakarta.jpg",
            description: "Cultural heart with ancient temples and heritage",
            hotels: hotels.filter(h => h.location.toLowerCase().includes('yogyakarta') || h.location.toLowerCase().includes('magelang')).length,
            location: "yogyakarta"
        }
    ];

    const handleDestinationClick = (location) => {
        // Navigate to hotels page with location filter
        navigate(`/hotels?location=${location}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Hero onSearch={handleSearch} />

            {/* Featured Hotels Section */}
            <section className="py-20 px-6 bg-white">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Featured Properties
                            <div className="h-1 w-20 bg-orange-500 mt-2"></div>
                        </h2>
                        <Link
                            to="/hotels"
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            View All Hotels →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white h-[400px] rounded-xl shadow-lg"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {hotels.slice(0, 6).map(hotel => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Popular Destinations Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Popular Destinations
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Discover the most sought-after destinations in Indonesia, each offering unique experiences and world-class accommodations.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {destinations.map((destination, index) => (
                            <div key={index} className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 h-full">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={destination.image}
                                        alt={destination.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                                        {destination.hotels} Hotels
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{destination.name}</h3>
                                    <p className="text-gray-600 mb-4 flex-1">{destination.description}</p>
                                    <button
                                        onClick={() => handleDestinationClick(destination.location)}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-auto"
                                    >
                                        Explore {destination.name} →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Travel Blog Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Travel Stories & Tips
                            <div className="h-1 w-20 bg-orange-500 mt-2"></div>
                        </h2>
                        <Link
                            to="/blog"
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                            Read More Stories →
                        </Link>
                    </div>

                    {blogs.length > 0 ? (
                        <div className="grid md:grid-cols-3 gap-8">
                            {blogs.map(post => (
                                <Link key={post.id} to={`/blog/${post.id}`}
                                    className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 h-full">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:5001${post.imageUrl}`) : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=250&fit=crop'}
                                            alt={post.title}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                            {post.content.substring(0, 120)}...
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
                                            <span>By {post.author}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-4">Loading travel stories...</div>
                            <div className="animate-pulse flex space-x-4 justify-center">
                                <div className="bg-gray-300 h-4 w-32 rounded"></div>
                                <div className="bg-gray-300 h-4 w-24 rounded"></div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
                        Why Choose Stayverse
                    </h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-16 h-16 mx-auto mb-6 bg-orange-500 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 to-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                        Discover amazing hotels and create unforgettable memories across Indonesia's most beautiful destinations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/hotels"
                            className="bg-white text-orange-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Browse Hotels
                        </Link>
                        <Link
                            to="/contact"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
