const catchAsync = require("../utils/catchAsync");
const tmdbService = require("../services/tmdbService");
const Genre = require("../models/Genre");

// Get all movie genres
exports.getMovieGenres = catchAsync(async (req, res) => {
  // First try to get from database
  let genres = await Genre.find({ type: "movie" });
  
  // If no genres in database or data needs refreshing, fetch from API
  if (!genres || genres.length === 0) {
    const data = await tmdbService.getGenres();
    genres = await Genre.find({ type: "movie" });
  }
  
  res.json(genres);
});

// Get all TV show genres
exports.getTvGenres = catchAsync(async (req, res) => {
  // First try to get from database
  let genres = await Genre.find({ type: "tv" });
  
  // If no genres in database or data needs refreshing, fetch from API
  if (!genres || genres.length === 0) {
    const data = await tmdbService.getTvGenres();
    genres = await Genre.find({ type: "tv" });
  }
  
  res.json(genres);
});

// Get a specific genre by ID
exports.getGenreById = catchAsync(async (req, res) => {
  const { genreId } = req.params;
  const { type = "movie" } = req.query; // Default to movie if type not specified
  
  const genre = await Genre.findOne({ id: parseInt(genreId), type });
  
  if (!genre) {
    return res.status(404).json({ message: "Genre not found" });
  }
  
  res.json(genre);
});

// Get movies by genre
exports.getMoviesByGenre = catchAsync(async (req, res) => {
  const { genreId, page = 1 } = req.query;
  
  if (!genreId) {
    return res.status(400).json({ message: "Genre ID is required" });
  }
  
  const data = await tmdbService.getMoviesByGenre(genreId, page);
  res.json(data);
});

// Get TV shows by genre
exports.getTvShowsByGenre = catchAsync(async (req, res) => {
  const { genreId, page = 1 } = req.query;
  
  if (!genreId) {
    return res.status(400).json({ message: "Genre ID is required" });
  }
  
  // Use discover TV shows with genre filter
  const data = await tmdbService.discoverTvShows({
    page,
    with_genres: genreId
  });
  
  res.json(data);
});