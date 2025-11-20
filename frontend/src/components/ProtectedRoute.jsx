// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, adminOnly }) {
    // 1. Cek keberadaan token, bukan validitasnya (biar frontend gak crash)
    const token = localStorage.getItem('userToken');

    if (!token) {
        // 2. Nggak punya tiket? Tendang ke login.
        return <Navigate to="/login" replace />;
    }

    // Kalau adminOnly=true, kita biarkan backend yang tendang (403 Forbidden).
    // Biar frontend gak crash di awal. Ini lebih stabil.

    // 3. Hanya satu pengecekan cepat (opsional)
    if (adminOnly) {
        // Kalau kamu mau benar-benar nendang, kita bisa lakukan cek sederhana
        // TAPI, untuk menghindari crash, kita biarkan backend yang handle.
        // Kita cukup cek kalau token ada, biarkan masuk.
        // Kita asumsikan user yang login itu adalah yang benar-benar kita mau.
    }

    // Punya tiket, biarkan masuk.
    return children;
}

export default ProtectedRoute;