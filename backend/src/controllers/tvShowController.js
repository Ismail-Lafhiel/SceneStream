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

  // Parse genre_ids into an array of numbers
  if (tvShowData.genre_ids) {
    if (typeof tvShowData.genre_ids === "string") {
      tvShowData.genre_ids = JSON.parse(tvShowData.genre_ids);
    }
    tvShowData.genre_ids = tvShowData.genre_ids.map((id) => Number(id));
  }

  // Auto-generate ID if not provided
  if (!tvShowData.id) {
    const highestTvShow = await TVShow.findOne().sort({ id: -1 });
    tvShowData.id = highestTvShow ? highestTvShow.id + 1 : 1;
  }

  // Create the TV show
  const tvShow = await TVShow.create(tvShowData);
  res.status(201).json(tvShow);
});

// Update an existing TV show
exports.updateTvShow = catchAsync(async (req, res) => {
  const { tvId } = req.params;
  const updateData = req.body;

  // Parse genre_ids into an array of numbers
  if (updateData.genre_ids) {
    if (typeof updateData.genre_ids === "string") {
      updateData.genre_ids = JSON.parse(updateData.genre_ids);
    }
    updateData.genre_ids = updateData.genre_ids.map((id) => Number(id));
  }

  // Update the TV show
  const tvShow = await TVShow.findOneAndUpdate(
    { id: parseInt(tvId) },
    updateData,
    { new: true, runValidators: true }
  );

  if (!tvShow) {
    return res.status(404).json({ message: "TV show not found" });
  }

  res.json(tvShow);
});

// Delete a TV show
exports.deleteTvShow = catchAsync(async (req, res) => {
  const { tvId } = req.params;

  const tvShow = await TVShow.findOneAndDelete({ id: parseInt(tvId) });

  if (!tvShow) {
    return res.status(404).json({ message: "TV show not found" });
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
