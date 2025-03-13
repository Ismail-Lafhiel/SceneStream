const {
  makeTmdbRequest,
  saveOrUpdateMovie,
  saveOrUpdateGenres,
  saveOrUpdateTVShow,
} = require("../helpers/tmdbHelpers");

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

  // Map TMDB data to IMovie interface
  const movieData = {
    id: data.id,
    title: data.title,
    overview: data.overview,
    backdrop_path: data.backdrop_path,
    poster_path: data.poster_path,
    release_date: data.release_date,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    genre_ids: data.genres.map((genre) => genre.id),
  };

  // Save movie details to the database
  await saveOrUpdateMovie(movieData);

  return movieData;
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

exports.discoverMovies = async ({
  page = 1,
  with_genres,
  sort_by = "popularity.desc",
  search,
}) => {
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

exports.discoverTvShows = async ({
  page = 1,
  with_genres,
  sort_by = "popularity.desc",
  search,
}) => {
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
