// backend/src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const hotelController = require('../controllers/hotelController');
const blogController = require('../controllers/blogController');
const userController = require('../controllers/userController');
const cancellationController = require('../controllers/cancellationController');
const { protect, admin } = require('../middleware/authMiddleware');
const { uploadHotelImage, uploadBlogImage } = require('../middleware/uploadMiddleware');

// Semua route admin memerlukan autentikasi admin
router.use(protect, admin);

// --- DASHBOARD STATS ---
router.get('/stats', adminController.getDashboardStats); // Stats untuk admin dashboard
router.get('/public-stats', adminController.getPublicStats); // Stats untuk dashboard publik (opsional, tapi bisa dipakai admin juga)
router.get('/chart-data', adminController.getChartData); // Data chart untuk dashboard admin

// --- LOGS ---
router.get('/booking-logs', adminController.getBookingLogs); // Log booking terbaru (20 terakhir)
router.get('/cancellation-logs', adminController.getCancellationLogs); // Log pembatalan semua

// --- HOTEL MANAGEMENT ---
router.get('/hotels', hotelController.getAllHotels); // Get all hotels (untuk admin list view)
router.get('/hotels/:id', hotelController.getHotelById); // Get hotel by ID (untuk edit form)
router.post('/hotels', uploadHotelImage.single('image'), hotelController.createHotel); // Create new hotel with image upload
router.put('/hotels/:id', uploadHotelImage.single('image'), hotelController.updateHotel); // Update hotel with image upload
router.delete('/hotels/:id', hotelController.deleteHotel); // Delete hotel

// --- BLOG MANAGEMENT ---
router.get('/blogs', blogController.getAllBlogs); // Get all blogs (untuk admin list view)
router.get('/blogs/:id', blogController.getBlogById); // Get blog by ID (untuk edit form)
router.post('/blogs', uploadBlogImage.single('image'), blogController.createBlog); // Create new blog with image upload
router.put('/blogs/:id', uploadBlogImage.single('image'), blogController.updateBlog); // Update blog with image upload
router.delete('/blogs/:id', blogController.deleteBlog); // Delete blog

// --- USER MANAGEMENT ---
router.get('/users', userController.getUsers); // Get all users (untuk admin list view)
router.put('/users/:id', userController.updateUser); // Update user (role, dll.)
router.delete('/users/:id', userController.deleteUser); // Delete user

// --- CANCELLATION MANAGEMENT ---
router.get('/cancellations', cancellationController.getCancellationRequests); // Get all cancellation requests (untuk admin list view)
router.put('/cancellations/:id', cancellationController.updateRequestStatus); // Approve/reject cancellation request

module.exports = router;
