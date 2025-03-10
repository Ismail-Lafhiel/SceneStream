const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

// Public route: Fetch popular movies
router.get('/', movieController.getAllMovies);
router.get('/popular', movieController.getPopularMovies);

// Admin-only route: Fetch popular movies
router.get('/', movieController.getMoviesFromDB);


module.exports = router;