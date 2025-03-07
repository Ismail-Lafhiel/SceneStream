const catchAsync = require("../utils/catchAsync");
const bookmarkService = require("../services/bookmarkService");

/**
 * Create a new bookmark (movie or TV show)
 */
exports.createBookmark = catchAsync(async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { type, ...data } = req.body; // Extract type (movie or tv) and bookmark data

  let bookmark;
  if (type === "movie") {
    bookmark = await bookmarkService.createMovieBookmark(userId, data);
  } else if (type === "tv") {
    bookmark = await bookmarkService.createTvShowBookmark(userId, data);
  } else {
    throw new Error("Invalid bookmark type. Must be 'movie' or 'tv'.");
  }

  res.status(201).json({
    status: "success",
    data: bookmark,
  });
});

/**
 * Delete a bookmark (movie or TV show)
 */
exports.deleteBookmark = catchAsync(async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { type, id } = req.params; // Extract type (movie or tv) and bookmark ID

  let result;
  if (type === "movie") {
    result = await bookmarkService.deleteMovieBookmark(userId, id);
  } else if (type === "tv") {
    result = await bookmarkService.deleteTvShowBookmark(userId, id);
  } else {
    throw new Error("Invalid bookmark type. Must be 'movie' or 'tv'.");
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get all bookmarks (movies and TV shows) for the authenticated user
 */
exports.getUserBookmarks = catchAsync(async (req, res) => {
  const userId = req.user.id; // From auth middleware

  const bookmarks = await bookmarkService.getUserBookmarks(userId);

  res.status(200).json({
    status: "success",
    results: bookmarks.length,
    data: bookmarks,
  });
});