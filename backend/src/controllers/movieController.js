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

// Add a new controller to fetch movies directly from the database
exports.getMoviesFromDatabase = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "popularity",
    order = "desc",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sort] = order === "desc" ? -1 : 1;

  const movies = await Movie.find()
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const totalMovies = await Movie.countDocuments();

  res.json({
    results: movies,
    page: parseInt(page),
    total_pages: Math.ceil(totalMovies / parseInt(limit)),
    total_results: totalMovies,
  });
});
