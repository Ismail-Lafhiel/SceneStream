const catchAsync = require("../utils/catchAsync");
const tmdbService = require("../services/tmdbService");
const Movie = require("../models/movie");

exports.getPopularMovies = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getPopularMovies(page);
  res.json(data);
});

exports.getTrendingMovies = catchAsync(async (req, res) => {
  const { timeWindow = "week" } = req.query;
  const data = await tmdbService.getTrendingMovies(timeWindow);
  res.json(data);
});

exports.getNewReleases = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getNewReleases(page);
  res.json(data);
});

exports.getMovieDetails = catchAsync(async (req, res) => {
  const { movieId } = req.params;

  // First try to get from database
  let movie = await Movie.findOne({ id: parseInt(movieId) });

  // If not found or incomplete data, fetch from API
  if (!movie || !movie.credits) {
    const data = await tmdbService.getMovieDetails(movieId);
    res.json(data);
  } else {
    res.json(movie);
  }
});

exports.getSimilarMovies = catchAsync(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getSimilarMovies(movieId);
  res.json(data);
});

exports.getTopRatedMovies = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getTopRatedMovies(page);
  res.json(data);
});

exports.getNowPlayingMovies = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getNowPlayingMovies(page);
  res.json(data);
});

exports.getUpcomingMovies = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getUpcomingMovies(page);
  res.json(data);
});

exports.getMovieVideos = catchAsync(async (req, res) => {
  const { movieId } = req.params;
  const data = await tmdbService.getMovieVideos(movieId);
  res.json(data);
});

exports.discoverMovies = catchAsync(async (req, res) => {
  const { page = 1, with_genres, sort_by, search } = req.query;
  const data = await tmdbService.discoverMovies({
    page,
    with_genres,
    sort_by,
    search,
  });
  res.json(data);
});

// Create a new movie
exports.createMovie = catchAsync(async (req, res) => {
  const movieData = req.body;

  // Check if movie with this ID already exists
  const existingMovie = await Movie.findOne({ id: movieData.id });
  if (existingMovie) {
    return res.status(400).json({
      message:
        "Movie with this ID already exists. Use update endpoint instead.",
    });
  }

  // Create movie with uploaded image paths (if any)
  const movie = await Movie.create(movieData);
  res.status(201).json(movie);
});

// Update an existing movie
exports.updateMovie = catchAsync(async (req, res) => {
  const { movieId } = req.params;
  const updateData = req.body;

  // Find the existing movie to check for images that might need to be deleted
  const existingMovie = await Movie.findOne({ id: parseInt(movieId) });

  if (!existingMovie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Handle deletion of old images if new ones are uploaded
  if (updateData.poster_path && existingMovie.poster_path) {
    await deleteFromS3(existingMovie.poster_path);
  }

  if (updateData.backdrop_path && existingMovie.backdrop_path) {
    await deleteFromS3(existingMovie.backdrop_path);
  }

  // Update the movie record
  const movie = await Movie.findOneAndUpdate(
    { id: parseInt(movieId) },
    updateData,
    { new: true, runValidators: true }
  );

  res.json(movie);
});

// Delete a movie
exports.deleteMovie = catchAsync(async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findOneAndDelete({ id: parseInt(movieId) });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  // Delete associated images from S3
  if (movie.poster_path) {
    await deleteFromS3(movie.poster_path);
  }

  if (movie.backdrop_path) {
    await deleteFromS3(movie.backdrop_path);
  }

  res.status(204).send();
});

// Get all movies with pagination, filtering and sorting
exports.getAllMovies = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "popularity",
    order = "desc",
    genre,
    year,
    query,
  } = req.query;

  // Build filter object
  const filter = {};

  if (genre) {
    filter.genre_ids = parseInt(genre);
  }

  if (year) {
    filter.release_date = new RegExp(`^${year}`);
  }

  if (query) {
    filter.$text = { $search: query };
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sort] = order === "desc" ? -1 : 1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const movies = await Movie.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const totalMovies = await Movie.countDocuments(filter);

  res.json({
    results: movies,
    page: parseInt(page),
    total_pages: Math.ceil(totalMovies / parseInt(limit)),
    total_results: totalMovies,
  });
});
