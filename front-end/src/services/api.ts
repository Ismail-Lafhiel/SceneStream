import axios from "axios";
import { IMovie, IGenre, IPaginatedResponse } from "@/interfaces";

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_APP_TMDB_API_KEY,
    language: "en-US",
  },
});

export const movieService = {
  getPopularMovies: async (page = 1) => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      "/movie/popular",
      {
        params: { page },
      }
    );
    return data;
  },

  getTrendingMovies: async (timeWindow: "day" | "week" = "week") => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      `/trending/movie/${timeWindow}`
    );
    return data;
  },

  getMoviesByGenre: async (genreId: number, page = 1) => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      "/discover/movie",
      {
        params: {
          with_genres: genreId,
          page,
        },
      }
    );
    return data;
  },

  getGenres: async () => {
    const { data } = await tmdbApi.get<{ genres: IGenre[] }>(
      "/genre/movie/list"
    );
    return data.genres;
  },

  getNewReleases: async (page = 1) => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      "/movie/now_playing",
      {
        params: { page },
      }
    );
    return data;
  },
  getMovieVideos: async (movieId: number) => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/videos`);
    return data;
  },
  getMovieDetails: async (movieId: number) => {
    const { data } = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "credits,videos",
      },
    });
    return data;
  },

  getSimilarMovies: async (movieId: number) => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/similar`);
    return data;
  },
  getPopularTvShows: async (page = 1) => {
    const { data } = await tmdbApi.get("/tv/popular", { params: { page } });
    return data;
  },

  getTvShowDetails: async (tvId: number) => {
    const { data } = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: "credits,videos",
      },
    });
    return data;
  },

  getSimilarTvShows: async (tvId: number) => {
    const { data } = await tmdbApi.get(`/tv/${tvId}/similar`);
    return data;
  },
  getTopRatedMovies: async (page = 1) => {
    const { data } = await tmdbApi.get("/movie/top_rated", {
      params: { page },
    });
    return data;
  },

  getNowPlayingMovies: async (page = 1) => {
    const { data } = await tmdbApi.get("/movie/now_playing", {
      params: { page },
    });
    return data;
  },

  getUpcomingMovies: async (page = 1) => {
    const { data } = await tmdbApi.get("/movie/upcoming", { params: { page } });
    return data;
  },
};
