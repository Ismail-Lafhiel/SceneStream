const catchAsync = require('../utils/catchAsync');
const tmdbService = require('../services/tmdbService');

/**
 * Fetch popular movies from TMDB API and store them in the database (public route).
 */
exports.getPopularMovies = catchAsync(async (req, res) => {
  const movies = await tmdbService.fetchAndStorePopularMovies();
  res.json(movies);
});

/**
 * Fetch movies from the database (admin-only route).
 */
exports.getMoviesFromDB = catchAsync(async (req, res) => {
  const movies = await tmdbService.getMoviesFromDB();
  res.json(movies);
});