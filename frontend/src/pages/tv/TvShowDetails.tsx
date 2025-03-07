import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPlay,
  FaStar,
  FaTv,
  FaCalendar,
  FaLanguage,
  FaList,
  FaBookmark,
} from "react-icons/fa";
import { tvService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TrailerModal } from "@/components/common/TrailerModal";
import { Cast } from "@/components/tv/Cast";
import { SimilarShows } from "@/components/tv/SimilarShows";
import { Loading } from "@/components/common/Loading";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { TvShowDetailsInterface } from "@/interfaces";

export const TvShowDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useDarkMode();
  const [show, setShow] = useState<TvShowDetailsInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const { addBookmark, isBookmarked } = useBookmarks();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await tvService.getTvShowDetails(Number(id));
        setShow(data);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        setError("Failed to load TV show details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTvShowDetails();
    }
  }, [id]);

  const handleAddToBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to bookmark");
      return;
    }

    if (!show) {
      toast.error("Details not available");
      return;
    }

    try {
      // Check if already bookmarked to prevent duplicate requests
      if (isBookmarked(show.id)) {
        toast.error("This item is already in your bookmarks");
        return;
      }

      // Make sure the show data has the right structure for a TV show
      const tvShowData = {
        ...show,
        // Ensure these fields exist to match MovieDetailsInterface
        media_type: "tv",
        // If your API strictly checks for movie vs tv, ensure the data has proper structure
      };

      // Add the bookmark with the correct type
      await addBookmark("tv", tvShowData);

      // Success message is handled in the addBookmark function
    } catch (error: any) {
      console.error("Bookmark error:", error);

      // More descriptive error messages based on the error
      if (error.response && error.response.status === 400) {
        toast.error("Invalid data. Please try again.");
      } else if (error.response && error.response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
      } else if (error.response && error.response.status === 409) {
        toast.error("Item already in bookmarks");
      } else {
        toast.error("Failed to bookmark. Please try again later.");
      }
    }
  };

  if (isLoading) return <Loading />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!show) return null;

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
            src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Show Poster */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-64 flex-shrink-0"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="w-full rounded-xl shadow-2xl"
                />
              </motion.div>

              {/* Show Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 space-y-4"
              >
                <h1 className="text-4xl font-bold text-white">{show.name}</h1>

                {show.tagline && (
                  <p className="text-xl text-gray-300 italic">
                    "{show.tagline}"
                  </p>
                )}

                <div className="flex items-center gap-4 text-gray-300">
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {show.vote_average.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaTv />
                    {show.number_of_seasons} Season
                    {show.number_of_seasons !== 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaList />
                    {show.number_of_episodes} Episode
                    {show.number_of_episodes !== 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FaCalendar />
                    {new Date(show.first_air_date).getFullYear()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <p className="text-gray-300 max-w-2xl">{show.overview}</p>

                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <FaLanguage className="text-lg" />
                    {show.spoken_languages
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
                    onClick={handleAddToBookmark}
                    className="px-6 py-3 bg-gray-100 text-gray-800 font-medium hover:bg-gray-300 cursor-pointer rounded-lg flex items-center gap-2 transition-colors"
                    disabled={show ? isBookmarked(show.id) : false}
                  >
                    <FaBookmark className="text-gray-800" />
                    {show && isBookmarked(show.id)
                      ? "Bookmarked"
                      : "Add to bookmark"}
                  </button>
                </div>

                {/* Status Badge */}
                <div className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-sm">
                  {show.status}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Cast Section */}
        <Cast cast={show.credits.cast} />

        {/* Similar Shows */}
        <SimilarShows showId={show.id} />
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movieId={show.id}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        type="tv"
      />
    </div>
  );
};

export default TvShowDetails;
