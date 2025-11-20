// src/components/Header.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('userToken');
    const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate(0); // Refresh halaman
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
            ${isScrolled || !isHomePage ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6">
                <nav className="relative flex items-center h-24">
                    {/* Logo with gradient effect - positioned absolutely left */}
                    <div className="absolute left-0">
                        <Link to="/" className="flex items-center group">
                            <span className="text-3xl font-bold">
                                <span className="text-orange-500 group-hover:text-orange-600 transition-all duration-300">
                                    Stay
                                </span>
                                <span className="text-blue-400 group-hover:text-blue-500 transition-all duration-300">
                                    verse
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - centered */}
                    <div className="hidden lg:flex items-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/hotels" className={`${isHomePage && !isScrolled ? 'text-white hover:text-orange-500' : 'text-gray-700 hover:text-orange-500'} font-medium transition-colors`}>Hotels</Link>
                        <Link to="/dashboard" className={`${isHomePage && !isScrolled ? 'text-white hover:text-orange-500' : 'text-gray-700 hover:text-orange-500'} font-medium transition-colors`}>Dashboard</Link>
                        <Link to="/blog" className={`${isHomePage && !isScrolled ? 'text-white hover:text-orange-500' : 'text-gray-700 hover:text-orange-500'} font-medium transition-colors`}>Blog</Link>
                        <Link to="/contact" className={`${isHomePage && !isScrolled ? 'text-white hover:text-orange-500' : 'text-gray-700 hover:text-orange-500'} font-medium transition-colors`}>Contact</Link>
                    </div>

                    {/* Auth Section - positioned absolutely right */}
                    <div className="hidden lg:flex items-center space-x-4 absolute right-0">
                        {token ? (
                            <>
                                <Link to="/profile" className={`${isHomePage && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-orange-500 font-medium`}>
                                    My Profile
                                </Link>
                                {userRole === 'admin' && (
                                    <Link to="/admin" className={`${isHomePage && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-orange-500 font-medium`}>
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 font-medium transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden absolute right-0">
                        <button className={`${isHomePage && !isScrolled ? 'text-white' : 'text-gray-700'} hover:text-orange-500 transition-colors`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 
                        ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                        onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-2xl p-6"
                            onClick={e => e.stopPropagation()}>
                            {/* Mobile menu content */}
                            <div className="space-y-4">
                                <Link to="/hotels" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">Hotels</Link>
                                <Link to="/dashboard" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">Dashboard</Link>
                                <Link to="/blog" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">Blog</Link>
                                <Link to="/contact" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">Contact</Link>
                                {token ? (
                                    <>
                                        <Link to="/profile" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">
                                            My Profile
                                        </Link>
                                        {userRole === 'admin' && (
                                            <Link to="/admin" className="block text-gray-700 hover:text-orange-500 font-medium transition-colors">
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 font-medium transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="w-full bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 font-medium transition-colors"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Header;
