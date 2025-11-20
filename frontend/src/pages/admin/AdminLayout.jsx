// src/pages/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-orange-500 via-blue-600 to-orange-500"> {/* ⬅️ Orange and Blue Background Admin */}

            <AdminSidebar />

            {/* Konten Utama Admin */}
            <div className="flex-1 p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default AdminLayout;
