const axios = require("axios");
const { ApiError } = require("../utils/errors");
const Movie = require("../models/movie");
const TVShow = require("../models/tvshow");
const config = require("../config/config");

const TMDB_API_KEY = config.TMDB_API_KEY;
const TMDB_BASE_URL = config.TMDB_BASE_URL;

/**
 * Fetch all movies from TMDB API and store them in the database.
 * Fetches 30 movies per page by combining results from multiple TMDB pages.
 */
exports.fetchAllMovies = async () => {
  try {
    let page = 1;
    let allMovies = [];
    const moviesPerPage = 30; // Number of movies to fetch per "page"

    // Fetch movies in chunks of 30 per page
    while (true) {
      const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);
      const movies = response.data.results;

      if (movies.length === 0) {
        break; // No more movies to fetch
      }

      // Add movies to the list
      allMovies = allMovies.concat(movies);

      // Stop if we've fetched enough movies for the current "page"
      if (allMovies.length >= moviesPerPage) {
        break;
      }

      page++;
    }

    // Sync movies with the database
    for (const movieData of allMovies.slice(0, moviesPerPage)) {
      // Ensure required fields are present
      const movieToSave = {
        id: movieData.id,
        title: movieData.title || "Unknown Title",
        overview: movieData.overview || "",
        backdrop_path: movieData.backdrop_path || "",
        poster_path: movieData.poster_path || "",
        release_date: movieData.release_date || "1970-01-01",
        vote_average: movieData.vote_average || 0,
        vote_count: movieData.vote_count || 0,
        genre_ids: movieData.genre_ids || [],
      };

      // Check if the movie already exists in the database
      let movie = await Movie.findOne({ id: movieData.id });

      if (!movie) {
        // Create a new movie if it doesn't exist
        movie = new Movie(movieToSave);
        await movie.save();
      } else {
        // Update the movie if it already exists
        movie.set(movieToSave);
        await movie.save();
      }
    }

    return allMovies.slice(0, moviesPerPage); // Return only 30 movies per "page"
  } catch (error) {
    console.error("Error fetching and storing all movies from TMDB:", error);
    throw new ApiError(500, "Failed to fetch and store all movies from TMDB");
  }
};

/**
 * Fetch all TV shows from TMDB API and store them in the database.
 * Fetches 30 TV shows per page by combining results from multiple TMDB pages.
 */
exports.fetchAllTVShows = async () => {
  try {
    let page = 1;
    let allTVShows = [];
    const tvShowsPerPage = 30; // Number of TV shows to fetch per "page"

    // Fetch TV shows in chunks of 30 per page
    while (true) {
      const url = `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`;
      const response = await axios.get(url);
      const tvShows = response.data.results;

      if (tvShows.length === 0) {
        break; // No more TV shows to fetch
      }

      // Add TV shows to the list
      allTVShows = allTVShows.concat(tvShows);

      // Stop if we've fetched enough TV shows for the current "page"
      if (allTVShows.length >= tvShowsPerPage) {
        break;
      }

      page++;
    }

    // Sync TV shows with the database
    for (const tvShowData of allTVShows.slice(0, tvShowsPerPage)) {
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

    return allTVShows.slice(0, tvShowsPerPage); // Return only 30 TV shows per "page"
  } catch (error) {
    console.error("Error fetching and storing all TV shows from TMDB:", error);
    throw new ApiError(500, "Failed to fetch and store all TV shows from TMDB");
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
