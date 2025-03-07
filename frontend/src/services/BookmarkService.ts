import axios from "axios";
import { MovieDetailsInterface, TvShowDetailsInterface } from "@/interfaces";
import { getUserIdFromToken } from "@/utils/authUtils";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

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

    const bookmarkData = {
      userId,
      type,
      ...data,
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
    return [];
  }
};
