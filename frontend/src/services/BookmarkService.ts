import axios from "axios";
import { MovieDetailsInterface } from "@/interfaces";
import { getUserIdFromToken } from "@/utils/authUtils";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const createBookmark = async (
  movie: MovieDetailsInterface,
  token: string
) => {
  try {
    const userId = getUserIdFromToken(token);
    if (!userId) throw new Error("User ID not found in token");

    if (!movie.id || !movie.title)
      throw new Error("Movie is missing required ID or title");

    const bookmarkData = {
      userId,
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path || "",
      backdrop_path: movie.backdrop_path || "",
      vote_average: movie.vote_average || 0,
      runtime: movie.runtime || 0,
      release_date: movie.release_date || "",
      overview: movie.overview || "",
    };

    const response = await axios.post(`${BASE_URL}/bookmarks`, bookmarkData, {
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

export const deleteBookmark = async (movieId: number, token: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bookmarks/${movieId}`, {
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
    return [];
  }
};
