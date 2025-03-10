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

// Add a new controller to fetch TV shows directly from the database
exports.getTvShowsFromDatabase = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sort = "popularity",
    order = "desc",
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOptions = {};
  sortOptions[sort] = order === "desc" ? -1 : 1;

  const tvShows = await TVShow.find()
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit));

  const totalTvShows = await TVShow.countDocuments();

  res.json({
    results: tvShows,
    page: parseInt(page),
    total_pages: Math.ceil(totalTvShows / parseInt(limit)),
    total_results: totalTvShows,
  });
});
