import { Link } from "react-router-dom";

export default function Header() {
    const token = localStorage.getItem('userToken');

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        window.location.reload();
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
            <nav className="container flex items-center justify-between px-4 py-4 mx-auto">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-indigo-600">StayVerse</span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden space-x-8 lg:flex">
                    <Link to="/" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Home
                    </Link>
                    <Link to="/properties" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Properties
                    </Link>
                    <Link to="/blog" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Blog
                    </Link>
                    <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                        Contact
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center space-x-4">
                    {token ? (
                        <>
                            <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                                Profil Saya
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}
