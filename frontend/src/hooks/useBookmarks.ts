// hooks/useBookmarks.ts
import { useEffect, useState } from "react";
import { MovieDetailsInterface } from "@/interfaces";
import { movieService } from "@/services/api";
import {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
} from "@/services/BookmarkService";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

// Local storage key for bookmarks
const BOOKMARKS_STORAGE_KEY = import.meta.env.VITE_BOOKMARKS_STORAGE_KEY;

// Hook for managing bookmarks
export const useBookmarks = () => {
  const [bookmarkedMovies, setBookmarkedMovies] = useState<
    MovieDetailsInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAuthToken, isAuthenticated } = useAuth();

  // Load bookmarks from backend and local storage on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        setIsLoading(true);

        // Skip loading if not authenticated
        if (!isAuthenticated) {
          console.log("User not authenticated, skipping bookmark fetch");
          setBookmarkedMovies([]);
          setIsLoading(false);
          return;
        }

        // Get the token
        const token = await getAuthToken();
        if (!token) {
          console.log("No auth token available");
          setBookmarkedMovies([]);
          setIsLoading(false);
          return;
        }

        console.log("Fetching bookmarks with token");

        // Fetch bookmarks from backend
        const backendBookmarksResponse = await getUserBookmarks(token);

        // If getUserBookmarks returns an empty array (on error), initialize empty bookmarks
        if (
          !backendBookmarksResponse ||
          backendBookmarksResponse.length === 0
        ) {
          console.log("No bookmarks found or error occurred");
          setBookmarkedMovies([]);
          setIsLoading(false);
          return;
        }

        // Check the structure of the response
        console.log(
          "Backend bookmarks response type:",
          typeof backendBookmarksResponse
        );
        console.log(
          "Backend bookmarks structure:",
          JSON.stringify(backendBookmarksResponse).substring(0, 100) + "..."
        );

        // Ensure we have a valid array of bookmarks
        const backendBookmarks = Array.isArray(backendBookmarksResponse)
          ? backendBookmarksResponse
          : backendBookmarksResponse.data ||
            backendBookmarksResponse.bookmarks ||
            [];

        if (!Array.isArray(backendBookmarks)) {
          console.error("Backend bookmarks is not an array:", backendBookmarks);
          setBookmarkedMovies([]);
          setIsLoading(false);
          return;
        }

        console.log(`Processing ${backendBookmarks.length} bookmarks`);

        // Extract IDs safely
        const backendBookmarkIds = backendBookmarks
          .map((movie) => {
            const id = movie.movieId || movie.id;
            if (!id) {
              console.warn("Movie without ID found:", movie);
            }
            return id;
          })
          .filter(Boolean);

        console.log(`Found ${backendBookmarkIds.length} valid bookmark IDs`);

        // Update local storage with backend bookmarks
        localStorage.setItem(
          BOOKMARKS_STORAGE_KEY,
          JSON.stringify(backendBookmarkIds)
        );

        if (backendBookmarkIds.length === 0) {
          setBookmarkedMovies([]);
          setIsLoading(false);
          return;
        }

        // Fetch movie details for each bookmarked movie
        console.log("Fetching movie details for bookmarks");
        try {
          const movies = await Promise.all(
            backendBookmarkIds.map(async (id: number) => {
              try {
                return await movieService.getMovieDetails(id);
              } catch (movieError) {
                console.error(
                  `Failed to fetch details for movie ${id}:`,
                  movieError
                );
                return null;
              }
            })
          );

          // Filter out any null results from failed fetches
          const validMovies = movies.filter(Boolean) as MovieDetailsInterface[];
          console.log(
            `Successfully loaded ${validMovies.length} bookmarked movies`
          );

          // Set bookmarked movies
          setBookmarkedMovies(validMovies);
        } catch (detailsError) {
          console.error("Error fetching movie details:", detailsError);
          toast.error("Could not load some movie details");
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        toast.error("Failed to load bookmarks");
        // Initialize empty bookmarks array on error
        setBookmarkedMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [getAuthToken, isAuthenticated]);

  // Add movie to bookmarks
  const addBookmark = async (movie: MovieDetailsInterface | null) => {
    if (!movie) {
      toast.error("Cannot bookmark: No movie data provided");
      return;
    }

    try {
      // Get the token
      const token = await getAuthToken();
      if (!token) {
        toast.error("You must be logged in to bookmark movies");
        return;
      }

      // Check if already bookmarked
      const storedIds = JSON.parse(
        localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
      );
      if (storedIds.includes(movie.id)) {
        toast.error("This movie is already in your bookmarks");
        return;
      }

      console.log("Adding bookmark for movie:", movie.id, movie.title);

      // Add bookmark to backend
      await createBookmark(movie, token);

      // Update local storage and state
      const updatedIds = [...storedIds, movie.id];
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedIds));
      setBookmarkedMovies((prev) => [...prev, movie]);
      toast.success("Added to bookmarks!");
    } catch (error: any) {
      console.error("Error adding bookmark:", error);

      if (error.response?.status === 409) {
        toast.error("This movie is already in your bookmarks");
      } else {
        toast.error("Failed to add bookmark");
      }
    }
  };

  // Remove movie from bookmarks
  const removeBookmark = async (movieId: number) => {
    try {
      // Get the token
      const token = await getAuthToken();
      if (!token) {
        toast.error("You must be logged in to manage bookmarks");
        return;
      }

      console.log("Removing bookmark for movie:", movieId);

      // Remove bookmark from backend
      await deleteBookmark(movieId, token);

      // Update local storage
      const storedIds = JSON.parse(
        localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
      );
      const updatedIds = storedIds.filter((id: number) => id !== movieId);
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedIds));

      // Update state
      setBookmarkedMovies((prev) =>
        prev.filter((movie) => movie.id !== movieId)
      );
      toast.success("Removed from bookmarks!");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Failed to remove bookmark");
    }
  };

  // Check if a movie is bookmarked
  const isBookmarked = (movieId: number) => {
    const storedIds = JSON.parse(
      localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
    );
    return storedIds.includes(movieId);
  };

  return {
    bookmarkedMovies,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
  };
};
