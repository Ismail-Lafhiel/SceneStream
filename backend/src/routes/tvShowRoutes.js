const express = require('express');
const tvShowController = require('../controllers/tvShowController');

const router = express.Router();

// Public route: Fetch popular TV shows
router.get('/', tvShowController.getPopularTVShows);

// Admin-only route: Fetch popular TV shows
router.get('/', tvShowController.getTVShowsFromDB);

module.exports = router;