// src/components/admin/AdminSidebar.jsx
import { NavLink, Link } from 'react-router-dom';

function AdminSidebar() {
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center space-x-3 px-6 py-3 text-sm font-medium
        ${isActive
            ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white rounded-lg shadow-md'
            : 'text-gray-600 hover:text-white hover:bg-orange-500 rounded-lg'
        }`;

    return (
        <div className="w-64 min-h-screen bg-white text-gray-800 shadow-lg">
            <div className="px-6 py-8 border-b border-gray-200">
                <Link to="/" className="flex items-center group cursor-pointer">
                    <span className="text-2xl font-bold">
                        <span className="text-orange-500 group-hover:text-orange-600 transition-all duration-300">
                            Stay
                        </span>
                        <span className="text-blue-400 group-hover:text-blue-500 transition-all duration-300">
                            verse
                        </span>
                    </span>
                </Link>
                <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
            </div>

            <nav className="mt-8 px-4 space-y-2">
                <NavLink to="/admin" end className={getNavLinkClass}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                </NavLink>

                {/* NavLink 2: Manajemen Hotel */}
                <NavLink
                    to="/admin/hotels"
                    className={getNavLinkClass}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Manajemen Hotel</span>
                </NavLink>

                {/* NavLink 3: Manajemen User */}
                <NavLink
                    to="/admin/users"
                    className={getNavLinkClass}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Manajemen User</span>
                </NavLink>

                {/* NavLink 4: Manajemen Blog */}
                <NavLink
                    to="/admin/blog"
                    className={getNavLinkClass}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Manajemen Blog</span>
                </NavLink>

                {/* NavLink 5: Pengajuan Pembatalan */}
                <NavLink
                    to="/admin/cancellations"
                    className={getNavLinkClass}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <span>Manajemen Reservasi</span>
                </NavLink>

            </nav>
        </div>
    );
}

export default AdminSidebar;
