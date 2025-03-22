//@ts-nocheck
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

// Create base axios instance
const backendApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
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

// Get movie statistics
export const getMovieStatistics = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.get("/statistics/movies", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie statistics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch movie statistics"
    );
  }
};

// Get TV show statistics
export const getTVShowStatistics = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.get("/statistics/tvshows", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching TV show statistics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch TV show statistics"
    );
  }
};

// Get genre statistics
export const getGenreStatistics = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.get("/statistics/genres", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching genre statistics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch genre statistics"
    );
  }
};

// Get user statistics
export const getUserStatistics = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.get("/statistics/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user statistics"
    );
  }
};

// Get all statistics
export const getAllStatistics = async () => {
  try {
    const token = await getAuthToken();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await backendApi.get("/statistics", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all statistics:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch all statistics"
    );
  }
};
