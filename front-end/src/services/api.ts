import axios from "axios";
import { IPaginatedResponse, IMovie } from "@/interfaces";

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

  getMovieDetails: async (movieId: number) => {
    const { data } = await tmdbApi.get<IMovie>(`/movie/${movieId}`);
    return data;
  },

  // Add more movie-related API calls here
};

export default tmdbApi;
