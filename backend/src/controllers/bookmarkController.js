const catchAsync = require("../utils/catchAsync");
const bookmarkService = require("../services/bookmarkService");

/**
 * Create a new bookmark
 */
exports.createBookmark = catchAsync(async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const movieData = req.body;

  const bookmark = await bookmarkService.createBookmark(userId, movieData);

  res.status(201).json({
    status: "success",
    data: bookmark,
  });
});

/**
 * Delete a bookmark
 */
exports.deleteBookmark = catchAsync(async (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { movieId } = req.params;

  const result = await bookmarkService.deleteBookmark(userId, movieId);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get all bookmarks for the authenticated user
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
