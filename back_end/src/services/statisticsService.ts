import Movie from "../models/movie.model";
import TVShow from "../models/tvShow.model";
import Genre from "../models/genre.model";
import User from "../models/user.model";

export const statisticsService = {
  // Get movie statistics
  getMovieStatistics: async () => {
    try {
      const totalMovies = await Movie.countDocuments();
      const averageVote = await Movie.aggregate([
        { $group: { _id: null, avgVote: { $avg: "$vote_average" } } },
      ]);
      const highestRatedMovie = await Movie.findOne().sort({ vote_average: -1 });

      return {
        totalMovies,
        averageVote: averageVote[0]?.avgVote || 0,
        highestRatedMovie: highestRatedMovie
          ? {
              title: highestRatedMovie.title,
              vote_average: highestRatedMovie.vote_average,
            }
          : null,
      };
    } catch (error) {
      console.error("Error in getMovieStatistics:", error);
      throw error;
    }
  },

  // Get TV show statistics
  getTVShowStatistics: async () => {
    try {
      const totalTVShows = await TVShow.countDocuments();
      const averageVote = await TVShow.aggregate([
        { $group: { _id: null, avgVote: { $avg: "$vote_average" } } },
      ]);
      const highestRatedTVShow = await TVShow.findOne().sort({
        vote_average: -1,
      });

      return {
        totalTVShows,
        averageVote: averageVote[0]?.avgVote || 0,
        highestRatedTVShow: highestRatedTVShow
          ? {
              name: highestRatedTVShow.name,
              vote_average: highestRatedTVShow.vote_average,
            }
          : null,
      };
    } catch (error) {
      console.error("Error in getTVShowStatistics:", error);
      throw error;
    }
  },

  // Get genre statistics
  getGenreStatistics: async () => {
    try {
      const totalGenres = await Genre.countDocuments();
      const mostPopularGenre = await Movie.aggregate([
        { $unwind: "$genre_ids" },
        { $group: { _id: "$genre_ids", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "genres",
            localField: "_id",
            foreignField: "_id",
            as: "genre",
          },
        },
        { $unwind: "$genre" },
      ]);

      return {
        totalGenres,
        mostPopularGenre: mostPopularGenre[0]?.genre || null,
      };
    } catch (error) {
      console.error("Error in getGenreStatistics:", error);
      throw error;
    }
  },

  // Get user statistics
  getUserStatistics: async () => {
    try {
      const totalUsers = await User.countDocuments();
      const totalRegularUsers = await User.countDocuments({ role: "USER" });

      return {
        totalUsers,
        totalRegularUsers,
      };
    } catch (error) {
      console.error("Error in getUserStatistics:", error);
      throw error;
    }
  },

  // Get all statistics
  getAllStatistics: async () => {
    try {
      const movieStats = await statisticsService.getMovieStatistics();
      const tvShowStats = await statisticsService.getTVShowStatistics();
      const genreStats = await statisticsService.getGenreStatistics();
      const userStats = await statisticsService.getUserStatistics();

      return {
        movies: movieStats,
        tvShows: tvShowStats,
        genres: genreStats,
        users: userStats,
      };
    } catch (error) {
      console.error("Error in getAllStatistics:", error);
      throw error;
    }
  },
};