import { useEffect, useState } from "react";
import { MovieDetailsInterface } from "@/interfaces";
import { movieService } from "@/services/api";
import toast from "react-hot-toast";

// Local storage key for bookmarks
const BOOKMARKS_STORAGE_KEY = "movie_bookmarks";

// hook for managing bookmarks
export const useBookmarks = () => {
  const [bookmarkedMovies, setBookmarkedMovies] = useState<
    MovieDetailsInterface[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const storedIds = JSON.parse(
          localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
        );
        if (storedIds.length > 0) {
          const movies = await Promise.all(
            storedIds.map((id: number) => movieService.getMovieDetails(id))
          );
          setBookmarkedMovies(movies);
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        toast.error("Failed to load bookmarks");
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  // Add movie to bookmarks
  const addBookmark = (movie: MovieDetailsInterface | null) => {
    if (!movie) return;

    const storedIds = JSON.parse(
      localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
    );
    if (!storedIds.includes(movie.id)) {
      const updatedIds = [...storedIds, movie.id];
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedIds));
      setBookmarkedMovies((prev) => [...prev, movie]);
      toast.success("Added to bookmarks!");
    } else {
      toast.error("Movie already bookmarked!");
    }
  };

  // Remove movie from bookmarks
  const removeBookmark = (movieId: number) => {
    const storedIds = JSON.parse(
      localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "[]"
    );
    const updatedIds = storedIds.filter((id: number) => id !== movieId);
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedIds));
    setBookmarkedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
    toast.success("Removed from bookmarks!");
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
