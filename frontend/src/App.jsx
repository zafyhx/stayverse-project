// src/App.jsx

import { Routes, Route, useLocation } from 'react-router-dom';

// ------------------------------------------------------------------
// 1. KOMPONEN LAYOUT & PROTEKSI
// ------------------------------------------------------------------
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Footer from './components/Footer';

// ------------------------------------------------------------------
// 2. HALAMAN PUBLIK & USER
// ------------------------------------------------------------------
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CheckInPage from './pages/CheckInPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelsPage from './pages/HotelsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PublicDashboard from './pages/PublicDashboard';
import RegisterPage from './pages/RegisterPage';
import ReservationPage from './pages/ReservationPage';

// ------------------------------------------------------------------
// 3. HALAMAN ADMIN
// ------------------------------------------------------------------
import AdminDashboard from './pages/admin/AdminDashboard';
import BlogForm from './pages/admin/BlogForm';
import BlogListAdmin from './pages/admin/BlogListAdmin';
import HotelForm from './pages/admin/HotelForm';
import HotelListAdmin from './pages/admin/HotelListAdmin';
import UserForm from './pages/admin/UserForm';
import UserListAdmin from './pages/admin/UserListAdmin';
import CancellationListAdmin from './pages/admin/CancellationListAdmin';


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">

      {!isAdminRoute && <Header />}

      <main>
        <Routes>

          {/* ============================================== */}
          {/* RUTE PUBLIK DAN USER BIASA            */}
          {/* ============================================== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotel/:id" element={<HotelDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<PublicDashboard />} />
          <Route path="/check-in" element={<CheckInPage />} />

          {/* Rute PROTEKSI USER (Harus Login) */}
          <Route
            path="/book-hotel/:id"
            element={
              <ProtectedRoute>
                <ReservationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/check-in"
            element={
              <ProtectedRoute>
                <CheckInPage />
              </ProtectedRoute>
            }
          />

          {/* ============================================== */}
          {/* RUTE ADMIN PANEL                  */}
          {/* ============================================== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />

            {/* Manajemen Hotel (CRUD) */}
            <Route path="hotels" element={<HotelListAdmin />} />
            <Route path="hotels/add" element={<HotelForm />} />
            <Route path="hotels/edit/:id" element={<HotelForm />} />

            {/* Manajemen User (CRUD) */}
            <Route path="users" element={<UserListAdmin />} />
            <Route path="users/edit/:id" element={<UserForm />} />

            {/* Manajemen Blog (CRUD) */}
            <Route path="blog" element={<BlogListAdmin />} />
            <Route path="blog/add" element={<BlogForm />} />
            <Route path="blog/edit/:id" element={<BlogForm />} />

            {/* ⬅️ MANAJEMEN PEMBATALAN ⬅️ */}
            <Route path="cancellations" element={<CancellationListAdmin />} />
          </Route>

        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div >
  );
}

export default App;