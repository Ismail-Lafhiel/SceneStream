import axios from "axios";
import { MovieDetailsInterface, TvShowDetailsInterface } from "@/interfaces";
import { getUserIdFromToken } from "@/utils/authUtils";

const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

/**
 * Create a new bookmark (movie or TV show)
 */
export const createBookmark = async (
  type: "movie" | "tv",
  data: MovieDetailsInterface | TvShowDetailsInterface,
  token: string
) => {
  try {
    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error("User ID not found in token");

    let payload = {
      type,
      id: data.id,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      vote_average: data.vote_average,
      overview: data.overview,
    };

    if (type === "movie") {
      payload = {
        ...payload,
        //@ts-ignore
        title: (data as MovieDetailsInterface).title,
        release_date: (data as MovieDetailsInterface).release_date,
        runtime: (data as MovieDetailsInterface).runtime,
      };
    } else if (type === "tv") {
      payload = {
        ...payload,
        //@ts-ignore
        name: (data as TvShowDetailsInterface).name,
        first_air_date: (data as TvShowDetailsInterface).first_air_date,
        number_of_seasons: (data as TvShowDetailsInterface).number_of_seasons,
        number_of_episodes: (data as TvShowDetailsInterface).number_of_episodes,
      };
    }

    const response = await axios.post(`${BASE_URL}/bookmarks`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error creating bookmark:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }
    throw error;
  }
};

/**
 * Delete a bookmark (movie or TV show)
 */
export const deleteBookmark = async (
  type: "movie" | "tv",
  id: number,
  token: string
) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bookmarks/${type}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    throw error;
  }
};

/**
 * Get all bookmarks (movies and TV shows) for the authenticated user
 */
export const getUserBookmarks = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching bookmarks:", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    return { data: [] };
  }
};
