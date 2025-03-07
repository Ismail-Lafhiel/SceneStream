const MovieBookmark = require("../models/movieBookmark");
const { ApiError } = require("../utils/errors");

/**
 * Create a new bookmark for a user
 */
exports.createBookmark = async (userId, movieData) => {
  try {
    // Check if required fields exist
    if (!movieData.id || !movieData.title) {
      throw new ApiError(400, "Movie ID and title are required");
    }

    // Check if the bookmark already exists
    const existingBookmark = await MovieBookmark.findOne({
      userId,
      movieId: movieData.id,
    });

    if (existingBookmark) {
      throw new ApiError(409, "This movie is already bookmarked");
    }

    // Create the bookmark
    const bookmark = new MovieBookmark({
      userId,
      movieId: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      backdrop_path: movieData.backdrop_path,
      vote_average: movieData.vote_average,
      runtime: movieData.runtime,
      release_date: movieData.release_date,
      overview: movieData.overview,
    });

    await bookmark.save();
    return bookmark;
  } catch (error) {
    // If it's already our ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle mongoose duplicate key error
    if (error.code === 11000) {
      throw new ApiError(409, "This movie is already bookmarked");
    }
    console.error("Error creating bookmark:", error);
    throw new ApiError(500, "Failed to create bookmark");
  }
};

/**
 * Delete a bookmark
 */
exports.deleteBookmark = async (userId, movieId) => {
  try {
    // Find and delete the bookmark
    const result = await MovieBookmark.findOneAndDelete({
      userId,
      movieId: parseInt(movieId),
    });

    if (!result) {
      throw new ApiError(404, "Bookmark not found");
    }

    return { success: true, message: "Bookmark deleted successfully" };
  } catch (error) {
    // If it's already our ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error deleting bookmark:", error);
    throw new ApiError(500, "Failed to delete bookmark");
  }
};

/**
 * Get all bookmarks for a user
 */
exports.getUserBookmarks = async (userId) => {
  try {
    const bookmarks = await MovieBookmark.find({ userId }).sort({
      createdAt: -1,
    });

    // Transform to match frontend interface
    return bookmarks.map((bookmark) => ({
      id: bookmark.movieId,
      title: bookmark.title,
      poster_path: bookmark.poster_path,
      backdrop_path: bookmark.backdrop_path,
      vote_average: bookmark.vote_average,
      runtime: bookmark.runtime,
      release_date: bookmark.release_date,
      overview: bookmark.overview,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new ApiError(500, "Failed to fetch bookmarks");
  }
};
