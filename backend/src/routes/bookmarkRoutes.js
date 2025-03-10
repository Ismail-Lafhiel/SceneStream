const express = require('express');
const bookmarkController = require('../controllers/bookmarkController');

const router = express.Router();

// Create a bookmark (movie or TV show)
router.post('/', bookmarkController.createBookmark);

// Delete a bookmark (movie or TV show)
router.delete('/:type/:id', bookmarkController.deleteBookmark);

// Get all bookmarks (movies and TV shows) for the authenticated user
router.get('/', bookmarkController.getUserBookmarks);

module.exports = router;