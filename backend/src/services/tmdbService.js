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

// Movies
exports.getPopularMovies = async (page = 1) => {
  const data = await makeTmdbRequest("/movie/popular", { page });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getTrendingMovies = async (timeWindow = "week") => {
  const data = await makeTmdbRequest(`/trending/movie/${timeWindow}`);

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getMoviesByGenre = async (genreId, page = 1) => {
  const data = await makeTmdbRequest("/discover/movie", {
    with_genres: genreId,
    page,
  });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getGenres = async () => {
  const data = await makeTmdbRequest("/genre/movie/list");

  // Save genres to the database
  await saveOrUpdateGenres(data.genres, "movie");

  return data.genres;
};

exports.getNewReleases = async (page = 1) => {
  const data = await makeTmdbRequest("/movie/now_playing", { page });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getMovieDetails = async (movieId) => {
  const data = await makeTmdbRequest(`/movie/${movieId}`, {
    append_to_response: "credits,videos",
  });

  // Save movie details to the database
  await saveOrUpdateMovie(data);

  return data;
};

exports.getSimilarMovies = async (movieId) => {
  const data = await makeTmdbRequest(`/movie/${movieId}/similar`);

  // Save similar movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getTopRatedMovies = async (page = 1) => {
  const data = await makeTmdbRequest("/movie/top_rated", { page });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getNowPlayingMovies = async (page = 1) => {
  const data = await makeTmdbRequest("/movie/now_playing", { page });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getUpcomingMovies = async (page = 1) => {
  const data = await makeTmdbRequest("/movie/upcoming", { page });

  // Save movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

exports.getMovieVideos = async (movieId) => {
  return makeTmdbRequest(`/movie/${movieId}/videos`);
};

exports.discoverMovies = async ({ page = 1, with_genres, sort_by = "popularity.desc", search }) => {
  const endpoint = search ? "/search/movie" : "/discover/movie";
  const data = await makeTmdbRequest(endpoint, {
    page,
    with_genres,
    sort_by,
    query: search,
  });

  // Save discovered movies to the database
  for (const movie of data.results) {
    await saveOrUpdateMovie(movie);
  }

  return data;
};

// TV Shows
exports.getPopularTvShows = async (page = 1) => {
  const data = await makeTmdbRequest("/tv/popular", { page });

  // Save TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};

exports.getTopRatedTvShows = async (page = 1) => {
  const data = await makeTmdbRequest("/tv/top_rated", { page });

  // Save TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};

exports.getOnAirTvShows = async (page = 1) => {
  const data = await makeTmdbRequest("/tv/on_the_air", { page });

  // Save TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};

exports.getUpcomingTvShows = async (page = 1) => {
  const data = await makeTmdbRequest("/tv/airing_today", { page });

  // Save TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};

exports.getTvGenres = async () => {
  const data = await makeTmdbRequest("/genre/tv/list");

  // Save TV genres to the database
  await saveOrUpdateGenres(data.genres, "tv");

  return data.genres;
};

exports.getTvShowVideos = async (tvId) => {
  return makeTmdbRequest(`/tv/${tvId}/videos`);
};

exports.getTvShowDetails = async (tvId) => {
  const data = await makeTmdbRequest(`/tv/${tvId}`, {
    append_to_response: "credits,videos",
  });

  // Save TV show details to the database
  await saveOrUpdateTVShow(data);

  return data;
};

exports.getSimilarTvShows = async (tvId) => {
  const data = await makeTmdbRequest(`/tv/${tvId}/similar`);

  // Save similar TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};

exports.discoverTvShows = async ({ page = 1, with_genres, sort_by = "popularity.desc", search }) => {
  const endpoint = search ? "/search/tv" : "/discover/tv";
  const data = await makeTmdbRequest(endpoint, {
    page,
    with_genres,
    sort_by,
    query: search,
  });

  // Save discovered TV shows to the database
  for (const tvShow of data.results) {
    await saveOrUpdateTVShow(tvShow);
  }

  return data;
};