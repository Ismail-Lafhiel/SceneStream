const { ApiError } = require("../utils/errors");

// Validate movie data
exports.validateMovieData = (req, res, next) => {
  const { id, title, release_date } = req.body;

  if (!id) {
    return next(new ApiError(400, "Movie ID is required"));
  }

  if (!title) {
    return next(new ApiError(400, "Movie title is required"));
  }

  // Convert id to number if it's a string
  if (typeof req.body.id === "string") {
    req.body.id = parseInt(req.body.id);
  }

  next();
};

// Validate TV show data
exports.validateTvShowData = (req, res, next) => {
  const { id, name } = req.body;

  if (!id) {
    return next(new ApiError(400, "TV show ID is required"));
  }

  if (!name) {
    return next(new ApiError(400, "TV show name is required"));
  }

  // Convert id to number if it's a string
  if (typeof req.body.id === "string") {
    req.body.id = parseInt(req.body.id);
  }

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
