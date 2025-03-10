const axios = require("axios");
const { ApiError } = require("../utils/errors");
const Movie = require("../models/movie");
const TVShow = require("../models/tvshow");
const config = require("../config/config");

const TMDB_API_KEY = config.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetch popular movies from TMDB API and store them in the database.
 */
exports.fetchAndStorePopularMovies = async () => {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
    const response = await axios.get(url);
    const movies = response.data.results;

    // Sync movies with the database
    for (const movieData of movies) {
      // Check if the movie already exists in the database
      let movie = await Movie.findOne({ id: movieData.id });

      if (!movie) {
        // Create a new movie if it doesn't exist
        movie = new Movie(movieData);
        await movie.save();
      } else {
        // Update the movie if it already exists
        movie.set(movieData);
        await movie.save();
      }
    }

    return movies;
  } catch (error) {
    console.error("Error fetching and storing movies from TMDB:", error);
    throw new ApiError(500, "Failed to fetch and store movies from TMDB");
  }
};

/**
 * Fetch popular TV shows from TMDB API and store them in the database.
 */
exports.fetchAndStorePopularTVShows = async () => {
  try {
    const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`;
    const response = await axios.get(url);
    const tvShows = response.data.results;

    // Sync TV shows with the database
    for (const tvShowData of tvShows) {
      // Ensure required fields are present
      const tvShowToSave = {
        id: tvShowData.id,
        name: tvShowData.name || "Unknown Title",
        overview: tvShowData.overview || "",
        backdrop_path: tvShowData.backdrop_path || "",
        poster_path: tvShowData.poster_path || "",
        first_air_date: tvShowData.first_air_date || "1970-01-01",
        vote_average: tvShowData.vote_average || 0,
        vote_count: tvShowData.vote_count || 0,
        genre_ids: tvShowData.genre_ids || [],
      };

      // Check if the TV show already exists in the database
      let tvShow = await TVShow.findOne({ id: tvShowData.id });

      if (!tvShow) {
        // Create a new TV show if it doesn't exist
        tvShow = new TVShow(tvShowToSave);
        await tvShow.save();
      } else {
        // Update the TV show if it already exists
        tvShow.set(tvShowToSave);
        await tvShow.save();
      }
    }

    return tvShows;
  } catch (error) {
    console.error("Error fetching and storing TV shows from TMDB:", error);
    throw new ApiError(500, "Failed to fetch and store TV shows from TMDB");
  }
};

/**
 * Fetch movies from the database.
 */
exports.getMoviesFromDB = async () => {
  try {
    const movies = await Movie.find({});
    return movies;
  } catch (error) {
    console.error("Error fetching movies from the database:", error);
    throw new ApiError(500, "Failed to fetch movies from the database");
  }
};

/**
 * Fetch TV shows from the database.
 */
exports.getTVShowsFromDB = async () => {
  try {
    const tvShows = await TVShow.find({});
    return tvShows;
  } catch (error) {
    console.error("Error fetching TV shows from the database:", error);
    throw new ApiError(500, "Failed to fetch TV shows from the database");
  }
};
