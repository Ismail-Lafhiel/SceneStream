const axios = require("axios");
const { ApiError } = require("../utils/errors");
const config = require("../config/config");
const Genre = require("../models/Genre");
const Movie = require("../models/movie");
const TVShow = require("../models/tvshow");

const TMDB_API_KEY = config.TMDB_API_KEY;
const TMDB_BASE_URL = config.TMDB_BASE_URL;

// Helper function to make TMDB API requests
const makeTmdbRequest = async (endpoint, params = {}) => {
  try {
    const url = `${TMDB_BASE_URL}${endpoint}`;
    const response = await axios.get(url, {
      params: {
        api_key: TMDB_API_KEY,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from TMDB API (${endpoint}):`, error);
    throw new ApiError(500, `Failed to fetch data from TMDB API (${endpoint})`);
  }
};

// Helper function to save or update a movie in the database
const saveOrUpdateMovie = async (movieData) => {
  let movie = await Movie.findOne({ id: movieData.id });

  if (!movie) {
    movie = new Movie(movieData);
  } else {
    movie.set(movieData);
  }

  await movie.save();
  return movie;
};

// Helper function to save or update a TV show in the database
const saveOrUpdateTVShow = async (tvShowData) => {
  let tvShow = await TVShow.findOne({ id: tvShowData.id });

  if (!tvShow) {
    tvShow = new TVShow(tvShowData);
  } else {
    tvShow.set(tvShowData);
  }

  await tvShow.save();
  return tvShow;
};

// Helper function to save or update genres in the database
const saveOrUpdateGenres = async (genres, type = "movie") => {
  for (const genreData of genres) {
    let genre = await Genre.findOne({ id: genreData.id, type });

    if (!genre) {
      genre = new Genre({ ...genreData, type });
    } else {
      genre.set(genreData);
    }

    await genre.save();
  }
};

module.exports = {
  makeTmdbRequest,
  saveOrUpdateMovie,
  saveOrUpdateTVShow,
  saveOrUpdateGenres
};