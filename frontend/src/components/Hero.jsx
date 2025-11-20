// src/components/Hero.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate = useNavigate();

    // State manajemen (Dari kode lama Anda)
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    const handleSearch = (e) => {
        e.preventDefault();
        // Arahkan ke halaman hotels dengan query params
        navigate(`/hotels?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
    };

    return (
        <div className="relative min-h-screen flex items-center overflow-hidden">

            {/* --- BAGIAN 1: VIDEO BACKGROUND (PENGGANTI GAMBAR) --- */}
            {/* Kita hapus div gambar & logic parallaxOffset yang bikin error */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover transform scale-105"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/Pembuatan_Video_Latar_Hotel.mp4" type="video/mp4" />
                Browser Anda tidak mendukung tag video.
            </video>

            {/* --- BAGIAN 2: OVERLAY --- */}
            {/* Overlay gelap agar teks dan form tetap terbaca di atas video */}
            <div className="absolute inset-0 bg-black/50" />

            {/* --- BAGIAN 3: KONTEN UTAMA (SEARCH FORM) --- */}
            {/* Ini adalah layout asli Anda yang saya pertahankan */}
            <div className="relative container mx-auto px-6 z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-xl text-gray-200 drop-shadow-md">
                        Discover amazing places at exclusive prices
                    </p>

                    {/* Search Form Container */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                        <form onSubmit={handleSearch} className="grid gap-6 md:grid-cols-4">

                            {/* Input Location */}
                            <div className="space-y-2 text-left">
                                <label className="text-white text-sm font-medium">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur border-2 border-transparent focus:border-orange-500 transition-all duration-300 text-gray-800"
                                    placeholder="Where to?"
                                />
                            </div>

                            {/* Input Check In */}
                            <div className="space-y-2 text-left">
                                <label className="text-white text-sm font-medium">Check In</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur border-2 border-transparent focus:border-orange-500 transition-all duration-300 text-gray-800"
                                />
                            </div>

                            {/* Input Check Out */}
                            <div className="space-y-2 text-left">
                                <label className="text-white text-sm font-medium">Check Out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur border-2 border-transparent focus:border-orange-500 transition-all duration-300 text-gray-800"
                                />
                            </div>

                            {/* Search Button */}
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="w-full bg-orange-500 text-white py-3.5 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg hover:shadow-orange-500/50"
                                >
                                    Search Hotels
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Fade (Pemanis di bagian bawah) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-0" />
        </div>
    );
}

export default Hero;