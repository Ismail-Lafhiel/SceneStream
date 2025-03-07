const MovieBookmark = require("../models/movieBookmark");
const TvShowBookmark = require("../models/tvshowBookmark");
const { ApiError } = require("../utils/errors");

/**
 * Create a new movie bookmark for a user
 */
exports.createMovieBookmark = async (userId, movieData) => {
  try {
    if (!movieData.id || !movieData.title) {
      throw new ApiError(400, "Movie ID and title are required");
    }

    const existingBookmark = await MovieBookmark.findOne({
      userId,
      movieId: movieData.id,
    });

    if (existingBookmark) {
      throw new ApiError(409, "This movie is already bookmarked");
    }

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
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.code === 11000) {
      throw new ApiError(409, "This movie is already bookmarked");
    }
    console.error("Error creating movie bookmark:", error);
    throw new ApiError(500, "Failed to create movie bookmark");
  }
};

/**
 * Create a new TV show bookmark for a user
 */
exports.createTvShowBookmark = async (userId, tvShowData) => {
  try {
    if (!tvShowData.id || !tvShowData.name) {
      throw new ApiError(400, "TV show ID and name are required");
    }

    const existingBookmark = await TvShowBookmark.findOne({
      userId,
      tvShowId: tvShowData.id,
    });

    if (existingBookmark) {
      throw new ApiError(409, "This TV show is already bookmarked");
    }

    const bookmark = new TvShowBookmark({
      userId,
      tvShowId: tvShowData.id,
      name: tvShowData.name,
      poster_path: tvShowData.poster_path,
      backdrop_path: tvShowData.backdrop_path,
      vote_average: tvShowData.vote_average,
      first_air_date: tvShowData.first_air_date,
      number_of_seasons: tvShowData.number_of_seasons,
      number_of_episodes: tvShowData.number_of_episodes,
      overview: tvShowData.overview,
    });

    await bookmark.save();
    return bookmark;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error.code === 11000) {
      throw new ApiError(409, "This TV show is already bookmarked");
    }
    console.error("Error creating TV show bookmark:", error);
    throw new ApiError(500, "Failed to create TV show bookmark");
  }
};

/**
 * Delete a movie bookmark
 */
exports.deleteMovieBookmark = async (userId, movieId) => {
  try {
    const result = await MovieBookmark.findOneAndDelete({
      userId,
      movieId: parseInt(movieId),
    });

    if (!result) {
      throw new ApiError(404, "Movie bookmark not found");
    }

    return { success: true, message: "Movie bookmark deleted successfully" };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error deleting movie bookmark:", error);
    throw new ApiError(500, "Failed to delete movie bookmark");
  }
};

/**
 * Delete a TV show bookmark
 */
exports.deleteTvShowBookmark = async (userId, tvShowId) => {
  try {
    const result = await TvShowBookmark.findOneAndDelete({
      userId,
      tvShowId: parseInt(tvShowId),
    });

    if (!result) {
      throw new ApiError(404, "TV show bookmark not found");
    }

    return { success: true, message: "TV show bookmark deleted successfully" };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error("Error deleting TV show bookmark:", error);
    throw new ApiError(500, "Failed to delete TV show bookmark");
  }
};

/**
 * Get all bookmarks (movies and TV shows) for a user
 */
exports.getUserBookmarks = async (userId) => {
  try {
    // Fetch movie bookmarks
    const movieBookmarks = await MovieBookmark.find({ userId }).sort({
      createdAt: -1,
    });

    // Fetch TV show bookmarks
    const tvShowBookmarks = await TvShowBookmark.find({ userId }).sort({
      createdAt: -1,
    });

    // Transform movie bookmarks
    const transformedMovieBookmarks = movieBookmarks.map((bookmark) => ({
      type: "movie",
      id: bookmark.movieId,
      title: bookmark.title,
      poster_path: bookmark.poster_path,
      backdrop_path: bookmark.backdrop_path,
      vote_average: bookmark.vote_average,
      runtime: bookmark.runtime,
      release_date: bookmark.release_date,
      overview: bookmark.overview,
    }));

    // Transform TV show bookmarks
    const transformedTvShowBookmarks = tvShowBookmarks.map((bookmark) => ({
      type: "tv",
      id: bookmark.tvShowId,
      name: bookmark.name,
      poster_path: bookmark.poster_path,
      backdrop_path: bookmark.backdrop_path,
      vote_average: bookmark.vote_average,
      first_air_date: bookmark.first_air_date,
      number_of_seasons: bookmark.number_of_seasons,
      number_of_episodes: bookmark.number_of_episodes,
      overview: bookmark.overview,
    }));

    // Combine and sort bookmarks by creation date
    const allBookmarks = [...transformedMovieBookmarks, ...transformedTvShowBookmarks].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return allBookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw new ApiError(500, "Failed to fetch bookmarks");
  }
};