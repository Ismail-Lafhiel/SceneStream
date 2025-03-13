const { ApiError } = require("../utils/errors");

// Validate movie data
exports.validateMovieData = (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body

  const { title, release_date } = req.body;

  // Required fields
  if (!title) {
    return next(new ApiError(400, "Movie title is required"));
  }

  if (!release_date) {
    return next(new ApiError(400, "Release date is required"));
  }

  // Convert id to number if provided
  if (req.body.id && typeof req.body.id === "string") {
    req.body.id = parseInt(req.body.id);
  }

  // Set default values for optional fields
  if (!req.body.vote_average) req.body.vote_average = 0;
  if (!req.body.vote_count) req.body.vote_count = 0;

  next();
};

exports.validateTvShowData = (req, res, next) => {
  console.log("Request Body:", req.body); // Log the request body

  const { name, first_air_date } = req.body;

  // Required fields
  if (!name) {
    return next(new ApiError(400, "TV show name is required"));
  }

  if (!first_air_date) {
    return next(new ApiError(400, "First air date is required"));
  }

  // Convert id to number if provided
  if (req.body.id && typeof req.body.id === "string") {
    req.body.id = parseInt(req.body.id);
  }

  // Convert genre_ids to an array of numbers if provided
  if (req.body.genre_ids) {
    if (typeof req.body.genre_ids === "string") {
      try {
        req.body.genre_ids = JSON.parse(req.body.genre_ids); // Parse stringified array
      } catch (error) {
        return next(new ApiError(400, "Invalid genre_ids format"));
      }
    }
    if (!Array.isArray(req.body.genre_ids)) {
      return next(new ApiError(400, "genre_ids must be an array"));
    }
    req.body.genre_ids = req.body.genre_ids.map((id) => Number(id)); // Ensure all IDs are numbers
  }

  // Set default values for optional fields
  if (!req.body.vote_average) req.body.vote_average = 0;
  if (!req.body.vote_count) req.body.vote_count = 0;

  next();
};

// Validate genre data
exports.validateGenreData = (req, res, next) => {
  const { id, name, type } = req.body;

  if (!id) {
    return next(new ApiError(400, "Genre ID is required"));
  }

  if (!name) {
    return next(new ApiError(400, "Genre name is required"));
  }

  if (!type) {
    return next(new ApiError(400, "Genre type is required"));
  }

  if (type !== "movie" && type !== "tv") {
    return next(new ApiError(400, "Genre type must be either 'movie' or 'tv'"));
  }

  // Convert id to number if it's a string
  if (typeof req.body.id === "string") {
    req.body.id = parseInt(req.body.id);
  }

  next();
};
