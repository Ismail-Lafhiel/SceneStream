const catchAsync = require("../utils/catchAsync");
const tmdbService = require("../services/tmdbService");
const TVShow = require("../models/tvshow");

exports.getPopularTvShows = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getPopularTvShows(page);
  res.json(data);
});

exports.getTopRatedTvShows = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getTopRatedTvShows(page);
  res.json(data);
});

exports.getOnAirTvShows = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getOnAirTvShows(page);
  res.json(data);
});

exports.getUpcomingTvShows = catchAsync(async (req, res) => {
  const { page = 1 } = req.query;
  const data = await tmdbService.getUpcomingTvShows(page);
  res.json(data);
});

exports.getTvShowVideos = catchAsync(async (req, res) => {
  const { tvId } = req.params;
  const data = await tmdbService.getTvShowVideos(tvId);
  res.json(data);
});

exports.getTvShowDetails = catchAsync(async (req, res) => {
  const { tvId } = req.params;

  // First try to get from database
  let tvShow = await TVShow.findOne({ id: parseInt(tvId) });

  // If not found or incomplete data, fetch from API
  if (!tvShow || !tvShow.credits) {
    const data = await tmdbService.getTvShowDetails(tvId);
    res.json(data);
  } else {
    res.json(tvShow);
  }
});

exports.getSimilarTvShows = catchAsync(async (req, res) => {
  const { tvId } = req.params;
  const data = await tmdbService.getSimilarTvShows(tvId);
  res.json(data);
});

exports.discoverTvShows = catchAsync(async (req, res) => {
  const { page = 1, with_genres, sort_by, search } = req.query;
  const data = await tmdbService.discoverTvShows({
    page,
    with_genres,
    sort_by,
    search,
  });
  res.json(data);
});

// Create a new TV show
exports.createTvShow = catchAsync(async (req, res) => {
  const tvShowData = req.body;

  // Check if TV show with this ID already exists
  const existingTvShow = await TVShow.findOne({ id: tvShowData.id });
  if (existingTvShow) {
    return res.status(400).json({
      message:
        "TV show with this ID already exists. Use update endpoint instead.",
    });
  }

  // Create TV show with uploaded image paths (if any)
  const tvShow = await TVShow.create(tvShowData);
  res.status(201).json(tvShow);
});

// Update an existing TV show
exports.updateTvShow = catchAsync(async (req, res) => {
  const { tvId } = req.params;
  const updateData = req.body;

  // Find the existing TV show to check for images that might need to be deleted
  const existingTvShow = await TVShow.findOne({ id: parseInt(tvId) });

  if (!existingTvShow) {
    return res.status(404).json({ message: "TV show not found" });
  }

  // Handle deletion of old images if new ones are uploaded
  if (updateData.poster_path && existingTvShow.poster_path) {
    await deleteFromS3(existingTvShow.poster_path);
  }

  if (updateData.backdrop_path && existingTvShow.backdrop_path) {
    await deleteFromS3(existingTvShow.backdrop_path);
  }

  // Update the TV show record
  const tvShow = await TVShow.findOneAndUpdate(
    { id: parseInt(tvId) },
    updateData,
    { new: true, runValidators: true }
  );

  res.json(tvShow);
});

// Delete a TV show
exports.deleteTvShow = catchAsync(async (req, res) => {
  const { tvId } = req.params;

  const tvShow = await TVShow.findOneAndDelete({ id: parseInt(tvId) });

  if (!tvShow) {
    return res.status(404).json({ message: "TV show not found" });
  }

  // Delete associated images from S3
  if (tvShow.poster_path) {
    await deleteFromS3(tvShow.poster_path);
  }

  if (tvShow.backdrop_path) {
    await deleteFromS3(tvShow.backdrop_path);
  }

  res.status(204).send();
});

// Get all TV shows with pagination, filtering and sorting
exports.getAllTvShows = catchAsync(async (req, res) => {
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
    filter.first_air_date = new RegExp(`^${year}`);
  }

  if (query) {
    filter.$text = { $search: query };
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sort] = order === "desc" ? -1 : 1;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const tvShows = await TVShow.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const totalTvShows = await TVShow.countDocuments(filter);

  res.json({
    results: tvShows,
    page: parseInt(page),
    total_pages: Math.ceil(totalTvShows / parseInt(limit)),
    total_results: totalTvShows,
  });
});
