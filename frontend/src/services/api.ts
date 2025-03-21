import axios from "axios";
import {
  IMovie,
  IGenre,
  IPaginatedResponse,
  ITVShow,
  IVideo,
  DiscoverParams,
  TvShowDetailsInterface
} from "@/interfaces";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

const apiClient = axios.create({
  baseURL: `${BASE_URL}/tmdb`,
});

// movies api calls
export const movieService = {
  getPopularMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get<IPaginatedResponse<IMovie>>(
      "/movies/popular",
      {
        params: { page },
      }
    );
    return data;
  },

  getTrendingMovies: async (timeWindow: "day" | "week" = "week"): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get<IPaginatedResponse<IMovie>>(
      `/movies/trending`,
      {
        params: { timeWindow }
      }
    );
    return data;
  },

  getMoviesByGenre: async (genreId: number, page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get<IPaginatedResponse<IMovie>>(
      `/movies/genre/${genreId}`,
      {
        params: { page }
      }
    );
    return data;
  },

  getGenres: async (): Promise<IGenre[]> => {
    const { data } = await apiClient.get<IGenre[]>("/genres/movies");
    return data;
  },

  getNewReleases: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get<IPaginatedResponse<IMovie>>(
      "/movies/new-releases",
      {
        params: { page },
      }
    );
    return data;
  },

  getMovieDetails: async (movieId: number) => {
    const { data } = await apiClient.get(`/movies/${movieId}`);
    return data;
  },

  getSimilarMovies: async (movieId: number): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get(`/movies/${movieId}/similar`);
    return data;
  },

  getTopRatedMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get("/movies/top-rated", {
      params: { page },
    });
    return data;
  },

  getNowPlayingMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get("/movies/now-playing", {
      params: { page },
    });
    return data;
  },

  getUpcomingMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get("/movies/upcoming", { params: { page } });
    return data;
  },

  getMovieVideos: async (movieId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await apiClient.get(`/movies/${movieId}/videos`);
    return data;
  },

  discoverMovies: async ({
    page = 1,
    with_genres,
    sort_by = "popularity.desc",
    search,
  }: DiscoverParams): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await apiClient.get("/movies/discover", {
      params: {
        page,
        with_genres,
        sort_by,
        search,
      },
    });
    return data;
  },
};

// tv show api calls
export const tvService = {
  getPopularTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get("/tv/popular", { params: { page } });
    return data;
  },

  getTopRatedTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get("/tv/top-rated", { params: { page } });
    return data;
  },

  getOnAirTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get("/tv/on-air", { params: { page } });
    return data;
  },

  getUpcomingTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get("/tv/airing-today", {
      params: { page },
    });
    return data;
  },

  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await apiClient.get("/genres/tv");
    return data;
  },

  getTvShowVideos: async (tvId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await apiClient.get(`/tv/${tvId}/videos`);
    return data;
  },

  getTvShowDetails: async (tvId: number): Promise<TvShowDetailsInterface> => {
    const { data } = await apiClient.get(`/tv/${tvId}`);
    return data;
  },

  getSimilarTvShows: async (tvId: number): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get(`/tv/${tvId}/similar`);
    return data;
  },

  discoverTvShows: async ({
    page = 1,
    with_genres,
    sort_by = "popularity.desc",
    search,
  }: DiscoverParams): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await apiClient.get("/tv/discover", {
      params: {
        page,
        with_genres,
        sort_by,
        search,
      },
    });
    return data;
  },
};

// Extracted genre service to match backend structure
export const genreService = {
  getMovieGenres: async (): Promise<IGenre[]> => {
    const { data } = await apiClient.get("/genres/movies");
    return data;
  },

  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await apiClient.get("/genres/tv");
    return data;
  }
};