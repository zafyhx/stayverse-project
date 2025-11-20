// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});


api.interceptors.request.use(
    (config) => {
        // 1. Ambil token dari localStorage
        const token = localStorage.getItem('userToken');

        if (token) {
            // 2. Kalau ada, tempel di header
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config; // 3. Lanjutkan request
    },
    (error) => {
        return Promise.reject(error);
    }
);
// ---------------------------------------------------

// --- Fungsi untuk Hotel ---
export const getHotels = (params) => api.get('/hotels', { params });
export const getHotelById = (id) => api.get(`/hotels/${id}`);
export const createHotel = (data) => api.post('/hotels', data);
export const deleteHotel = (id) => api.delete(`/hotels/${id}`);
export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data);

// --- Fungsi untuk Auth ---
export const login = (data) => api.post('/users/login', data);
export const register = (data) => api.post('/users/register', data);

// --- Fungsi untuk Reservasi (YANG DIPROTEKSI) ---
export const createReservation = (data) => api.post('/reservations', data);
export const getMyReservations = () => api.get('/reservations/mine');


// --- Fungsi ADMIN User (HARUS ADA INI) ---
export const getUsers = () => api.get('/users');
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// --- Fungsi ADMIN Blog ---
export const getBlogPosts = () => api.get('/blog'); // 
export const createBlogPost = (data) => api.post('/blog', data); // 
export const getBlogPostById = (id) => api.get(`/blog/${id}`);
export const updateBlogPost = (id, data) => api.put(`/blog/${id}`, data);
export const deleteBlogPost = (id) => api.delete(`/blog/${id}`);

// --- Fungsi untuk Pembatalan (Admin) ---
export const requestCancellation = (data) => api.post('/cancellations', data);
export const getCancellationRequests = () => api.get('/cancellations');
export const updateCancellationStatus = (id, data) => api.put(`/cancellations/${id}`, data);
export const deleteCancellationRequest = (id) => api.delete(`/cancellations/${id}`);
export const getMyCancellationRequests = () => api.get('/cancellations/my');

// --- Fungsi ADMIN Statistik ---
export const getDashboardStats = () => api.get('/admin/stats');
export const getBookingLogs = () => api.get('/admin/booking-logs');
export const getCancellationLogs = () => api.get('/admin/cancellation-logs');

// --- Fungsi Profil User ---
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (data) => api.put('/users/profile', data);

// --- Fungsi Check-in ---
export const checkInReservation = (data) => api.post('/reservations/check-in', data);

// --- Fungsi Statistik Publik ---
export const getPublicStats = () => api.get('/admin/public-stats');

// --- Fungsi untuk Chart Data ---
export const getChartData = () => api.get('/admin/chart-data');

export default api;
