const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const hotelUploadDir = path.join(__dirname, '../../uploads/hotels');
const blogUploadDir = path.join(__dirname, '../../uploads/blogs');

if (!fs.existsSync(hotelUploadDir)) {
    fs.mkdirSync(hotelUploadDir, { recursive: true });
}
if (!fs.existsSync(blogUploadDir)) {
    fs.mkdirSync(blogUploadDir, { recursive: true });
}

// Storage configuration for hotels
const hotelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, hotelUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'hotel-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage configuration for blogs
const blogStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, blogUploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'blog-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter to allow only images
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer instances
const uploadHotelImage = multer({
    storage: hotelStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const uploadBlogImage = multer({
    storage: blogStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    uploadHotelImage,
    uploadBlogImage
};
