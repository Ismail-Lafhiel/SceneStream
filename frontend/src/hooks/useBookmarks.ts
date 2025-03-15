import { useEffect, useState } from "react";
import { MovieDetailsInterface, TvShowDetailsInterface } from "@/interfaces";
import { movieService, tvService } from "@/services/api";
import {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
} from "@/services/BookmarkService";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<
    (MovieDetailsInterface | TvShowDetailsInterface)[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAuthToken, isAuthenticated } = useAuth();

  // Load bookmarks from backend on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setIsLoading(true);

        // Skip loading if not authenticated
        if (!isAuthenticated) {
          console.log("User not authenticated, skipping bookmark fetch");
          setBookmarks([]);
          setIsLoading(false);
          return;
        }

        // Get the token
        const token = await getAuthToken();
        if (!token) {
          console.log("No auth token available");
          setBookmarks([]);
          setIsLoading(false);
          return;
        }

        // Fetch bookmarks from backend
        const response = await getUserBookmarks(token);

        // Extract the `data` array from the response
        const backendBookmarks = response.data || [];

        // Ensure backendBookmarks is an array
        if (!Array.isArray(backendBookmarks)) {
          console.error("Backend bookmarks is not an array:", backendBookmarks);
          setBookmarks([]);
          setIsLoading(false);
          return;
        }

        // If no bookmarks found, initialize empty bookmarks
        if (backendBookmarks.length === 0) {
          console.log("No bookmarks found or error occurred");
          setBookmarks([]);
          setIsLoading(false);
          return;
        }

        // Fetch details for each bookmarked item
        const bookmarkDetails = await Promise.all(
          backendBookmarks.map(async (bookmark: any) => {
            try {
              if (bookmark.type === "movie") {
                return await movieService.getMovieDetails(bookmark.id);
              } else if (bookmark.type === "tv") {
                return await tvService.getTvShowDetails(bookmark.id);
              }
            } catch (error) {
              console.error(
                `Failed to fetch details for ${bookmark.type} ${bookmark.id}:`,
                error
              );
              return null;
            }
          })
        );

        // Filter out any null results from failed fetches
        const validBookmarks = bookmarkDetails.filter(Boolean);
        console.log(`Successfully loaded ${validBookmarks.length} bookmarks`);

        // Set bookmarks
        setBookmarks(validBookmarks);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        toast.error("Failed to load bookmarks");
        setBookmarks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [getAuthToken, isAuthenticated]);

  // Add a bookmark (movie or TV show)
  const addBookmark = async (
    type: "movie" | "tv",
    data: MovieDetailsInterface | TvShowDetailsInterface
  ) => {
    if (!data) {
      toast.error("Cannot bookmark: No data provided");
      return;
    }

    try {
      // Get the token
      const token = await getAuthToken();
      if (!token) {
        toast.error("You must be logged in to bookmark");
        return;
      }

      // Add bookmark to backend
      await createBookmark(type, data, token);

      // Update state
      setBookmarks((prev) => [...prev, data]);
      toast.success("Added to bookmarks!");
    } catch (error: any) {
      console.error("Error adding bookmark:", error);

      if (error.response?.status === 409) {
        toast.error("This item is already in your bookmarks");
      } else {
        toast.error("Failed to add bookmark");
      }
    }
  };

  // Remove a bookmark (movie or TV show)
  const removeBookmark = async (type: "movie" | "tv", id: number) => {
    try {
      // Get the token
      const token = await getAuthToken();
      if (!token) {
        toast.error("You must be logged in to manage bookmarks");
        return;
      }

      // Remove bookmark from backend
      await deleteBookmark(type, id, token);

      // Update state
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
      toast.success("Removed from bookmarks!");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  // Check if an item is bookmarked
  const isBookmarked = (id: number) => {
    return bookmarks.some((bookmark) => bookmark.id === id);
  };

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};