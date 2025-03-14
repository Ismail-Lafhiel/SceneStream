import axios from "axios";
import {
  IMovie,
  ITVShow,
  IGenre,
  IVideo,
  IPaginatedResponse,
  DiscoverParams,
} from "../interfaces";

import config from "../config/config";

const { TMDB_API_KEY, TMDB_BASE_URL } = config;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const movieService = {
  // Fetch popular movies
  getPopularMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/popular", { params: { page } });
    return data;
  },

  // Fetch trending movies
  getTrendingMovies: async (
    timeWindow: "day" | "week" = "week"
  ): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return data;
  },

  // Fetch movies by genre
  getMoviesByGenre: async (
    genreId: number,
    page = 1
  ): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/discover/movie", {
      params: { with_genres: genreId, page },
    });
    return data;
  },

  // Fetch movie genres
  getGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get("/genre/movie/list");
    return data.genres;
  },

  // Fetch new releases
  getNewReleases: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/now_playing", {
      params: { page },
    });
    return data;
  },

  // Fetch movie details
  getMovieDetails: async (movieId: number): Promise<IMovie> => {
    const { data } = await tmdbApi.get(`/movie/${movieId}`, {
      params: { append_to_response: "credits,videos" },
    });
    return data;
  },

  // Fetch similar movies
  getSimilarMovies: async (
    movieId: number
  ): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/similar`);
    return data;
  },

  // Fetch top-rated movies
  getTopRatedMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/top_rated", {
      params: { page },
    });
    return data;
  },

  // Fetch now-playing movies
  getNowPlayingMovies: async (
    page = 1
  ): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/now_playing", {
      params: { page },
    });
    return data;
  },

  // Fetch upcoming movies
  getUpcomingMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/upcoming", { params: { page } });
    return data;
  },

  // Fetch movie videos
  getMovieVideos: async (movieId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/videos`);
    return data;
  },

  // Discover movies
  discoverMovies: async (
    params: DiscoverParams
  ): Promise<IPaginatedResponse<IMovie>> => {
    const endpoint = params.search ? "/search/movie" : "/discover/movie";
    const { data } = await tmdbApi.get(endpoint, { params });
    return data;
  },
};

export const tvService = {
  // Fetch popular TV shows
  getPopularTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/popular", { params: { page } });
    return data;
  },

  // Fetch top-rated TV shows
  getTopRatedTvShows: async (
    page = 1
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/top_rated", { params: { page } });
    return data;
  },

  // Fetch on-air TV shows
  getOnAirTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/on_the_air", { params: { page } });
    return data;
  },

  // Fetch upcoming TV shows
  getUpcomingTvShows: async (
    page = 1
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/airing_today", {
      params: { page },
    });
    return data;
  },

  // Fetch TV show genres
  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get("/genre/tv/list");
    return data.genres;
  },

  // Fetch TV show videos
  getTvShowVideos: async (tvId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}/videos`);
    return data;
  },

  // Fetch TV show details
  getTvShowDetails: async (tvId: number): Promise<ITVShow> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}`, {
      params: { append_to_response: "credits,videos" },
    });
    return data;
  },

  // Fetch similar TV shows
  getSimilarTvShows: async (
    tvId: number
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}/similar`);
    return data;
  },

  // Discover TV shows
  discoverTvShows: async (
    params: DiscoverParams
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const endpoint = params.search ? "/search/tv" : "/discover/tv";
    const { data } = await tmdbApi.get(endpoint, { params });
    return data;
  },
};

export const genreService = {
  // Fetch movie genres
  getMovieGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get("/genre/movie/list");
    return data.genres;
  },

  // Fetch TV show genres
  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get("/genre/tv/list");
    return data.genres;
  },
};
