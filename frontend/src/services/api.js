// src/services/api.js
import axios from 'axios';

// --- KONFIGURASI OTOMATIS (AUTO-SWITCH) ---
// Vite otomatis tahu kapan kita mode 'development' (laptop) atau 'production' (Vercel)
const isProduction = import.meta.env.MODE === 'production';

const api = axios.create({
    baseURL: isProduction
        ? 'https://stayverse-fry8wfq6q-zafyhxs-projects.vercel.app/api/' // 👈 GANTI LINK INI DENGAN URL BACKEND VERCEL ANDA
        : 'http://localhost:5001/api', // Kalau di laptop, pakai ini
});

// --- INTERCEPTOR (Token Auth) ---
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- FUNGSI API (SAMA SEPERTI SEBELUMNYA) ---

// Hotel
export const getHotels = (params) => api.get('/hotels', { params });
export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const createHotel = (data) => api.post('/hotels', data);
export const deleteHotel = (id) => api.delete(`/hotels/${id}`);
export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data);

// Auth
export const login = (data) => api.post('/users/login', data);
export const register = (data) => api.post('/users/register', data);

// Reservasi
export const createReservation = (data) => api.post('/reservations', data);
export const getMyReservations = () => api.get('/reservations/mine');

// Admin User
export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Admin Blog
export const getBlogPosts = () => api.get('/blog'); 
export const createBlogPost = (data) => api.post('/blog', data); 
export const getBlogPostById = (id) => api.get(`/blog/${id}`);
export const updateBlogPost = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => api.delete(`/blog/${id}`);

// Pembatalan (Admin)
export const requestCancellation = (data) => api.post('/cancellations', data);
export const getCancellationRequests = () => api.get('/cancellations');
export const updateCancellationStatus = (id, data) => api.put(`/cancellations/${id}`, data);
export const deleteCancellationRequest = (id) => api.delete(`/cancellations/${id}`);
export const getMyCancellationRequests = () => api.get('/cancellations/my');

// Statistik
export const getDashboardStats = () => api.get('/admin/stats');
export const getBookingLogs = () => api.get('/admin/booking-logs');
export const getCancellationLogs = () => api.get('/admin/cancellation-logs');
export const getPublicStats = () => api.get('/admin/public-stats');
export const getChartData = () => api.get('/admin/chart-data');

// Lain-lain
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);
export const checkInReservation = (data) => api.post('/reservations/check-in', data);

export default api;