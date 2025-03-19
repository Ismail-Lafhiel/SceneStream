import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaCalendar,
  FaTrash,
  FaPlay,
  FaFilm,
  FaTv,
  FaBookmark,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TrailerModal } from "@/components/common/TrailerModal";
import { Loading } from "@/components/common/Loading";
import { useBookmarks } from "@/hooks/useBookmarks";
import { MovieDetailsInterface, TvShowDetailsInterface } from "@/interfaces";

// Confirmation Dialog Component
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDarkMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDarkMode: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative z-10 w-full max-w-md p-6 rounded-xl shadow-2xl ${
          isDarkMode
            ? "bg-gray-800 border border-blue-500/30"
            : "bg-white border border-blue-200"
        }`}
      >
        <h3
          className={`text-xl font-bold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Remove from bookmarks?
        </h3>
        <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Are you sure you want to remove "{title}" from your bookmarks?
        </p>
        <div className="flex space-x-4 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium ${
              isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Custom Card component for both movies and TV shows
const MediaCard = ({
  item,
  type,
  onWatch,
  onRemove,
  isDarkMode,
}: {
  item: MovieDetailsInterface | TvShowDetailsInterface;
  type: "movie" | "tv";
  onWatch: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isMovie = type === "movie";
  const title = isMovie
    ? (item as MovieDetailsInterface).title
    : (item as TvShowDetailsInterface).name;
  const releaseDate = isMovie
    ? (item as MovieDetailsInterface).release_date
    : (item as TvShowDetailsInterface).first_air_date;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl overflow-hidden shadow-xl ${
        isDarkMode
          ? "bg-gray-800/60 backdrop-blur-sm border border-blue-500/20"
          : "bg-white/90 backdrop-blur-sm border border-blue-200/50"
      } hover:shadow-2xl transition-all duration-300`}
    >
      {/* Card Header with Poster */}
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${
            item.backdrop_path || item.poster_path
          }`}
          alt={title}
          className="w-full h-52 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://via.placeholder.com/500x281?text=No+Image+Available";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Floating Rating Badge */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <FaStar className="text-yellow-400" />
          <span className="text-white font-bold">
            {item.vote_average.toFixed(1)}
          </span>
        </div>

        {/* Media Type Badge */}
        <div className="absolute top-4 left-4 bg-blue-600/80 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
          {isMovie ? "Movie" : "TV Show"}
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="text-xl font-bold text-white truncate drop-shadow-lg">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-200">
            <FaCalendar className="text-blue-300" />
            <span>{new Date(releaseDate).getFullYear()}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Overview */}
        <p
          className={`${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } text-sm line-clamp-3 mb-4`}
        >
          {item.overview || "No overview available."}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onWatch}
            className="flex-1 cursor-pointer px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            <FaPlay className="text-sm" />
            <span>Watch Trailer</span>
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 bg-gradient-to-r cursor-pointer from-red-700 to-red-800 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/20"
            aria-label="Remove from bookmarks"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {isConfirmOpen && (
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={onRemove}
            title={title}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Bookmarks = () => {
  const { isDarkMode } = useDarkMode();
  const { bookmarks, isLoading, removeBookmark } = useBookmarks();
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number;
    type: "movie" | "tv";
  } | null>(null);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Separate bookmarks into movies and TV shows
  const bookmarkedMovies = bookmarks.filter(
    (bookmark) => "title" in bookmark
  ) as MovieDetailsInterface[];
  const bookmarkedTvShows = bookmarks.filter(
    (bookmark) => "name" in bookmark
  ) as TvShowDetailsInterface[];

  if (isLoading) return <Loading />;

  return (
    <div className="relative">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div
          className={`absolute inset-0 z-10 ${
            isDarkMode
              ? "bg-gradient-to-br from-blue-900/95 via-black/90 to-black/95"
              : "bg-gradient-to-br from-blue-100/95 via-white/90 to-white/95"
          }`}
        ></div>
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Background"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div
          className={`p-8 rounded-2xl backdrop-blur-sm mb-8 ${
            isDarkMode
              ? "bg-gray-800/30 border border-blue-500/20"
              : "bg-white/60 border border-blue-200/50"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <FaBookmark
              className={`text-3xl ${
                isDarkMode ? "text-blue-400" : "text-blue-600"
              }`}
            />
            <h1
              className={`text-4xl font-extrabold tracking-tight ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              My Bookmarks
            </h1>
          </div>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your personal collection of saved movies and TV shows
          </p>
        </div>

        {/* Bookmarked Movies Section */}
        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-8 rounded-2xl backdrop-blur-sm mb-8 ${
              isDarkMode
                ? "bg-gray-800/40 border border-blue-500/20"
                : "bg-white/80 border border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaFilm
                  className={`text-2xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Movies
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Your bookmarked movie collection
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-blue-900/50 text-blue-200"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {bookmarkedMovies.length}{" "}
                {bookmarkedMovies.length === 1 ? "movie" : "movies"}
              </div>
            </div>

            <div className="mt-6">
              {bookmarkedMovies.length === 0 ? (
                <div
                  className={`text-center py-12 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800/30 text-gray-300"
                      : "bg-gray-100/70 text-gray-500"
                  } backdrop-blur-sm`}
                >
                  <FaFilm className="mx-auto text-4xl mb-4 opacity-50" />
                  <p className="text-xl font-medium">
                    No bookmarked movies yet
                  </p>
                  <p className="text-sm mt-2">
                    Movies you bookmark will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedMovies.map((movie) => (
                    <MediaCard
                      key={movie.id}
                      item={movie}
                      type="movie"
                      isDarkMode={isDarkMode}
                      onWatch={() => {
                        setSelectedMedia({ id: movie.id, type: "movie" });
                        setIsTrailerOpen(true);
                      }}
                      onRemove={() => removeBookmark("movie", movie.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Bookmarked TV Shows Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-8 rounded-2xl backdrop-blur-sm ${
              isDarkMode
                ? "bg-gray-800/40 border border-blue-500/20"
                : "bg-white/80 border border-blue-200"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <FaTv
                  className={`text-2xl ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                />
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    TV Shows
                  </h2>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Your bookmarked TV show collection
                  </p>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-green-900/50 text-green-200"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {bookmarkedTvShows.length}{" "}
                {bookmarkedTvShows.length === 1 ? "show" : "shows"}
              </div>
            </div>

            <div className="mt-6">
              {bookmarkedTvShows.length === 0 ? (
                <div
                  className={`text-center py-12 rounded-xl ${
                    isDarkMode
                      ? "bg-gray-800/30 text-gray-300"
                      : "bg-gray-100/70 text-gray-500"
                  } backdrop-blur-sm`}
                >
                  <FaTv className="mx-auto text-4xl mb-4 opacity-50" />
                  <p className="text-xl font-medium">
                    No bookmarked TV shows yet
                  </p>
                  <p className="text-sm mt-2">
                    TV shows you bookmark will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookmarkedTvShows.map((tvShow) => (
                    <MediaCard
                      key={tvShow.id}
                      item={tvShow}
                      type="tv"
                      isDarkMode={isDarkMode}
                      onWatch={() => {
                        setSelectedMedia({ id: tvShow.id, type: "tv" });
                        setIsTrailerOpen(true);
                      }}
                      onRemove={() => removeBookmark("tv", tvShow.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      {/* Trailer Modal */}
      {selectedMedia && (
        <TrailerModal
          movieId={selectedMedia.id}
          isOpen={isTrailerOpen}
          onClose={() => {
            setIsTrailerOpen(false);
            setSelectedMedia(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookmarks;
