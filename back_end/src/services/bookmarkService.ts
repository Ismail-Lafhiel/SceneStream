import MovieBookmark from "../models/movieBookmark.model";
import TvShowBookmark from "../models/tvShowBookmark.model";
import { AppError } from "../utils/errors";
import {
  IMovieBookmark,
  ITvShowBookmark,
} from "../interfaces/bookmark.interface";

export const bookmarkService = {
  /**
   * Create a new movie bookmark for a user
   */
  createMovieBookmark: async (
    userId: string,
    movieData: any
  ): Promise<IMovieBookmark> => {
    if (!movieData.id || !movieData.title) {
      throw new AppError(400, "Movie ID and title are required");
    }

    const existingBookmark = await MovieBookmark.findOne({
      userId,
      movieId: movieData.id,
    });

    if (existingBookmark) {
      throw new AppError(409, "This movie is already bookmarked");
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
  },

  /**
   * Create a new TV show bookmark for a user
   */
  createTvShowBookmark: async (
    userId: string,
    tvShowData: any
  ): Promise<ITvShowBookmark> => {
    if (!tvShowData.id || !tvShowData.name) {
      throw new AppError(400, "TV show ID and name are required");
    }

    const existingBookmark = await TvShowBookmark.findOne({
      userId,
      tvShowId: tvShowData.id,
    });

    if (existingBookmark) {
      throw new AppError(409, "This TV show is already bookmarked");
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
  },

  /**
   * Delete a movie bookmark
   */
  deleteMovieBookmark: async (
    userId: string,
    movieId: number
  ): Promise<void> => {
    const result = await MovieBookmark.findOneAndDelete({
      userId,
      movieId,
    });

    if (!result) {
      throw new AppError(404, "Movie bookmark not found");
    }
  },

  /**
   * Delete a TV show bookmark
   */
  deleteTvShowBookmark: async (
    userId: string,
    tvShowId: number
  ): Promise<void> => {
    const result = await TvShowBookmark.findOneAndDelete({
      userId,
      tvShowId,
    });

    if (!result) {
      throw new AppError(404, "TV show bookmark not found");
    }
  },

  /**
   * Get all bookmarks (movies and TV shows) for a user
   */
  getUserBookmarks: async (userId: string): Promise<any[]> => {
    const movieBookmarks = await MovieBookmark.find({ userId }).sort({
      createdAt: -1,
    });
    const tvShowBookmarks = await TvShowBookmark.find({ userId }).sort({
      createdAt: -1,
    });

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

    return [...transformedMovieBookmarks, ...transformedTvShowBookmarks];
  },
};
