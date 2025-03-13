import axios from "axios";
import {
  IMovie,
  IGenre,
  IPaginatedResponse,
  ITVShow,
  IVideo,
} from "@/interfaces";
import { TVShowDetails } from "@/interfaces/utility.interface";
import { fetchAuthSession } from "aws-amplify/auth";

interface DiscoverParams {
  page?: number;
  with_genres?: number | null;
  sort_by?: string;
  search?: string;
}

const tmdbApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: import.meta.env.VITE_APP_TMDB_API_KEY,
    language: "en-US",
  },
});

// Create base axios instance
const backendApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to get token directly from Amplify
const getAuthToken = async () => {
  try {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.toString() || null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const createMovie = async (movieData) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.post("/movies", movieData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create movie error:", error);
    throw new Error(error.response?.data?.message || "Failed to create movie");
  }
};

export const getMovies = async () => {
  try {
    // Get the current auth token
    const token = await getAuthToken();

    const response = await backendApi.get("/movies", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch movies");
  }
};

// movies api calls
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

//tv show api calls
export const tvService = {
  getPopularTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/popular", { params: { page } });
    return data;
  },

  getTopRatedTvShows: async (
    page = 1
  ): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/top_rated", { params: { page } });
    return data;
  },

  getOnAirTvShows: async (page = 1): Promise<IPaginatedResponse<ITVShow>> => {
    const { data } = await tmdbApi.get("/tv/on_the_air", { params: { page } });
    return data;
  },

  getUpcomingTvShows: async (
    page = 1
  ): Promise<IPaginatedResponse<ITVShow>> => {
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

  getSimilarTvShows: async (
    tvId: number
  ): Promise<IPaginatedResponse<ITVShow>> => {
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
