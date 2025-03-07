import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaStar,
  FaClock,
  FaCalendar,
  FaLanguage,
  FaBookmark,
} from "react-icons/fa";
import { movieService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TrailerModal } from "@/components/common/TrailerModal";
import { Cast } from "@/components/movie/Cast";
import { SimilarMovies } from "@/components/movie/SimilarMovies";
import { Loading } from "@/components/common/Loading";
import { MovieDetailsInterface } from "@/interfaces";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useDarkMode();
  const [movie, setMovie] = useState<MovieDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { addBookmark, isBookmarked } = useBookmarks();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await movieService.getMovieDetails(Number(id));
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleAddToBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to bookmark a movie");
      return;
    }

    if (!movie) {
      toast.error("Movie details not available");
      return;
    }

    try {
      // Check if already bookmarked to prevent duplicate requests
      if (isBookmarked(movie.id)) {
        toast.error("This movie is already in your bookmarks");
        return;
      }

      // Add the bookmark
      await addBookmark(movie);

      // Success message is handled in the addBookmark function
    } catch (error: any) {
      console.error("Bookmark error:", error);

      // More descriptive error messages based on the error
      if (error.response && error.response.status === 400) {
        toast.error("Invalid movie data. Please try again.");
      } else if (error.response && error.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else if (error.response && error.response.status === 409) {
        toast.error("Movie already in bookmarks");
      } else {
        toast.error("Failed to bookmark movie. Please try again later.");
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!movie) return null;

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Movie Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-64 flex-shrink-0"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-xl shadow-2xl"
                />
              </motion.div>

              {/* Movie Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 space-y-4"
              >
                <h1 className="text-4xl font-bold text-white">{movie.title}</h1>

                <div className="flex items-center gap-4 text-gray-300">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaClock />
                    {movie.runtime} min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 max-w-2xl">{movie.overview}</p>

                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <FaLanguage className="text-lg" />
                    {movie.spoken_languages
                      .map((lang) => lang.english_name)
                      .join(", ")}
                  </span>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsTrailerOpen(true)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FaPlay />
                    Watch Trailer
                  </button>
                  <button
                    onClick={() => handleAddToBookmark()}
                    className="px-6 py-3 bg-gray-100 text-gray-800 font-medium hover:bg-gray-300 cursor-pointer rounded-lg flex items-center gap-2 transition-colors"
                    disabled={movie ? isBookmarked(movie.id) : false}
                  >
                    <FaBookmark className="text-gray-800" />
                    {movie && isBookmarked(movie.id)
                      ? "Bookmarked"
                      : "Add to bookmark"}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Cast Section */}
        <Cast cast={movie.credits.cast} />

        {/* Similar Movies */}
        <SimilarMovies movieId={movie.id} />
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movieId={movie.id}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </div>
  );
};

export default MovieDetails;
