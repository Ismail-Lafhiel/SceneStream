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

    // Ensure type is a valid value - this is what's causing your error
    if (type !== "movie" && type !== "tv") {
      throw new Error(
        `Invalid bookmark type: ${type}. Must be 'movie' or 'tv'.`
      );
    }

    // Create a clean bookmark object with required fields only
    const bookmarkData = {
      userId,
      type,
      id: data.id,
      // Add only necessary fields based on your backend requirements
      // For movies
      title: "title" in data ? data.title : undefined,
      poster_path: data.poster_path,
      // For TV shows
      name: "name" in data ? data.name : undefined,
    };

    console.log("Creating bookmark payload:", bookmarkData); // Log the payload

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
    // Ensure type is valid
    if (type !== "movie" && type !== "tv") {
      throw new Error(
        `Invalid bookmark type: ${type}. Must be 'movie' or 'tv'.`
      );
    }

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
    return { data: [] }; // Return expected format
  }
};
