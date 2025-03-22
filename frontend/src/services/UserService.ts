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

export const getUsers = async () => {
  try {
    // Get the current auth token
    const token = await getAuthToken();

    const response = await backendApi.get("/users", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};
