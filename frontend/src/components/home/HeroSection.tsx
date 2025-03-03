import { Link } from "react-router-dom";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IMovie } from "@/interfaces";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { motion, AnimatePresence } from "framer-motion";
import { movieService } from "@/services/api";
import axios from "axios";

export const HeroSection = () => {
  const { isDarkMode } = useDarkMode();
  const [featuredMovie, setFeaturedMovie] = useState<IMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousMovie, setPreviousMovie] = useState<IMovie | null>(null);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        setIsLoading(true);
        const data = await movieService.getPopularMovies();
        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)];
        setPreviousMovie(featuredMovie);
        setFeaturedMovie(randomMovie);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error fetching movie:",
            error.response?.data || error.message
          );
        } else {
          console.error("Error fetching movie:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovie();
    const intervalId = setInterval(fetchFeaturedMovie, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div
      className={`relative min-h-[90vh] flex items-end pb-20 sm:items-center sm:pb-0 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-t from-${
            isDarkMode ? "black" : "white"
          } via-black/50 to-transparent z-10`}
        ></div>
        <AnimatePresence mode="wait">
          {featuredMovie ? (
            <motion.img
              key={featuredMovie.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
              alt={featuredMovie.title}
            />
          ) : (
            <motion.div
              className={`w-full h-full ${
                isDarkMode ? "bg-gray-900" : "bg-gray-200"
              } animate-pulse`}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            {featuredMovie ? (
              <motion.div
                key={featuredMovie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 backdrop-blur-sm mb-4">
                  Featured Movie
                </span>
                <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
                  {featuredMovie.title}
                </h1>
                <div className="flex items-center gap-4 text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    {featuredMovie.vote_average.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(featuredMovie.release_date).getFullYear()}
                  </span>
                  <span className="px-2 py-1 text-sm rounded-md bg-gray-800/50 backdrop-blur-sm">
                    TMDB
                  </span>
                </div>
                <p
                  className={`text-lg ${
                    isDarkMode ? "text-gray-300" : "text-gray-200"
                  } leading-relaxed mb-8 line-clamp-3 sm:line-clamp-none`}
                >
                  {truncateText(featuredMovie.overview, 200)}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4 animate-pulse">
                <div
                  className={`h-8 w-32 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded-full`}
                ></div>
                <div
                  className={`h-14 w-3/4 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded-lg`}
                ></div>
                <div
                  className={`h-4 w-48 ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded`}
                ></div>
                <div
                  className={`h-20 w-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-300"
                  } rounded-lg`}
                ></div>
              </div>
            )}
          </AnimatePresence>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to={featuredMovie ? `/movie/${featuredMovie.id}` : "/register"}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25`}
            >
              <FaPlay className="text-sm" />
              <span>Watch Now</span>
            </Link>
            <Link
              to={
                featuredMovie ? `/movie/${featuredMovie.id}/details` : "/browse"
              }
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${
                isDarkMode
                  ? "bg-gray-800/50 hover:bg-gray-700/50"
                  : "bg-gray-200/50 hover:bg-gray-300/50"
              } text-${
                isDarkMode ? "white" : "gray-900"
              } font-medium backdrop-blur-sm transition-all duration-300 transform hover:scale-105`}
            >
              <FaInfoCircle />
              <span>More Info</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-${
          isDarkMode ? "black" : "white"
        } to-transparent z-10`}
      ></div>
    </div>
  );
};
