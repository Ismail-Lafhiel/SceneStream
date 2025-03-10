const catchAsync = require("../utils/catchAsync");
const tmdbService = require("../services/tmdbService");

/**
 * Fetch all TV shows from TMDB API and store them in the database (public route).
 */
exports.getAllTVShows = catchAsync(async (req, res) => {
  const tvShows = await tmdbService.fetchAllTVShows();
  res.json(tvShows);
});

/**
 * Fetch TV shows from the database (admin-only route).
 */
exports.getTVShowsFromDB = catchAsync(async (req, res) => {
  const tvShows = await tmdbService.getTVShowsFromDB();
  res.json(tvShows);
});

/**
 * Fetch popular TV shows from TMDB API and store them in the database (public route).
 */
exports.getPopularTVShows = catchAsync(async (req, res) => {
  const tvShows = await tmdbService.fetchAndStorePopularTVShows();
  res.json(tvShows);
});
