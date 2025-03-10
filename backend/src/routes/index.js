const express = require('express');
const userRoutes = require('./userRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const movieRoutes = require('./movieRoutes');
const tvShowRoutes = require('./tvShowRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes (no authentication required)
router.use('/movies', movieRoutes); // Public movie routes
router.use('/tvshows', tvShowRoutes); // Public TV show routes

// Protected routes (require authentication but not admin access)
router.use('/bookmarks', authMiddleware.protect, bookmarkRoutes); // Bookmark routes

// Admin routes (require authentication and admin access)
router.use('/admin', authMiddleware.protect, authMiddleware.checkAdminGroup, userRoutes); // Admin user routes

module.exports = router;