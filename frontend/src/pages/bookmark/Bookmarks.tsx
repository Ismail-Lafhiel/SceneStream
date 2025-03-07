import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaCalendar, FaTrash, FaPlay } from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TrailerModal } from "@/components/common/TrailerModal";
import { Loading } from "@/components/common/Loading";
import { useBookmarks } from "@/hooks/useBookmarks";
import { MovieDetailsInterface, TvShowDetailsInterface } from "@/interfaces";

export const Bookmarks = () => {
  const { isDarkMode } = useDarkMode();
  const { bookmarks, isLoading, removeBookmark } = useBookmarks();
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null);
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
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="relative bg-blue-600 h-48">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <h1 className="text-4xl font-bold text-white">My Bookmarks</h1>
        </div>
      </div>

      {/* Bookmarked Movies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Movies</h2>
        {bookmarkedMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No bookmarked movies yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold truncate">{movie.title}</h2>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  </div>

                  <p className="text-gray-500 line-clamp-2">{movie.overview}</p>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie.id);
                        setIsTrailerOpen(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaPlay />
                      Watch Trailer
                    </button>
                    <button
                      onClick={() => removeBookmark("movie", movie.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked TV Shows Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">TV Shows</h2>
        {bookmarkedTvShows.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No bookmarked TV shows yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedTvShows.map((tvShow) => (
              <motion.div
                key={tvShow.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl overflow-hidden shadow-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${tvShow.backdrop_path}`}
                    alt={tvShow.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h2 className="text-xl font-bold truncate">{tvShow.name}</h2>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {tvShow.vote_average.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FaCalendar />
                      {new Date(tvShow.first_air_date).getFullYear()}
                    </span>
                  </div>

                  <p className="text-gray-500 line-clamp-2">
                    {tvShow.overview}
                  </p>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => {
                        setSelectedMovie(tvShow.id);
                        setIsTrailerOpen(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaPlay />
                      Watch Trailer
                    </button>
                    <button
                      onClick={() => removeBookmark("tv", tvShow.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {selectedMovie && (
        <TrailerModal
          movieId={selectedMovie}
          isOpen={isTrailerOpen}
          onClose={() => {
            setIsTrailerOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default Bookmarks;
