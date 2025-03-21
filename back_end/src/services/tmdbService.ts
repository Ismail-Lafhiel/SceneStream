import axios from "axios";
import {
  IMovie,
  IGenre,
  IPaginatedResponse,
  ITVShow,
  IVideo,
  DiscoverParams,
  TVShowDetails
} from "../interfaces";
import config from "../config/config";

const { TMDB_API_KEY, TMDB_BASE_URL } = config;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "en-US",
  },
});

// Movie service
export const movieService = {
  getPopularMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      "/movie/popular",
      {
        params: { page },
      }
    );
    return data;
  },

  getTrendingMovies: async (timeWindow: "day" | "week" = "week"): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      `/trending/movie/${timeWindow}`
    );
    return data;
  },

  getMoviesByGenre: async (genreId: number, page = 1): Promise<IPaginatedResponse<IMovie>> => {
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

  getGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get<{ genres: IGenre[] }>(
      "/genre/movie/list"
    );
    return data.genres;
  },

  getNewReleases: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get<IPaginatedResponse<IMovie>>(
      "/movie/now_playing",
      {
        params: { page },
      }
    );
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

  getSimilarMovies: async (movieId: number): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/similar`);
    return data;
  },

  getTopRatedMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/top_rated", {
      params: { page },
    });
    return data;
  },

  getNowPlayingMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/now_playing", {
      params: { page },
    });
    return data;
  },

  getUpcomingMovies: async (page = 1): Promise<IPaginatedResponse<IMovie>> => {
    const { data } = await tmdbApi.get("/movie/upcoming", { params: { page } });
    return data;
  },

  getMovieVideos: async (movieId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await tmdbApi.get(`/movie/${movieId}/videos`);
    return data;
  },

  discoverMovies: async ({
    page = 1,
    with_genres,
    sort_by = "popularity.desc",
    search,
  }: DiscoverParams): Promise<IPaginatedResponse<IMovie>> => {
    const endpoint = search ? "/search/movie" : "/discover/movie";
    const { data } = await tmdbApi.get(endpoint, {
      params: {
        page,
        with_genres: with_genres || undefined,
        sort_by,
        query: search,
      },
    });
    return data;
  },
};

// TV show service
export const tvService = {
  getPopularTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/popular", { params: { page } });
    return data;
  },

  getTopRatedTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/top_rated", { params: { page } });
    return data;
  },

  getOnAirTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/on_the_air", { params: { page } });
    return data;
  },

  getUpcomingTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/airing_today", {
      params: { page },
    });
    return data;
  },

  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get("/genre/tv/list");
    return data.genres;
  },

  getTvShowVideos: async (tvId: number): Promise<{ results: IVideo[] }> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}/videos`);
    return data;
  },

  getTvShowDetails: async (tvId: number): Promise<TVShowDetails> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: "credits,videos",
      },
    });
    return data;
  },

  getSimilarTvShows: async (tvId: number): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get(`/tv/${tvId}/similar`);
    return data;
  },

  discoverTvShows: async ({
    page = 1,
    with_genres,
    sort_by = "popularity.desc",
    search,
  }: DiscoverParams): Promise<IPaginatedResponse<ITVShow>> => {
    const endpoint = search ? "/search/tv" : "/discover/tv";
    const { data } = await tmdbApi.get(endpoint, {
      params: {
        page,
        with_genres: with_genres || undefined,
        sort_by,
        query: search,
      },
    });
    return data;
  },
};

// Genre service (extract to match frontend organization)
export const genreService = {
  getMovieGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get<{ genres: IGenre[] }>("/genre/movie/list");
    return data.genres;
  },

  getTvGenres: async (): Promise<IGenre[]> => {
    const { data } = await tmdbApi.get<{ genres: IGenre[] }>("/genre/tv/list");
    return data.genres;
  }
};