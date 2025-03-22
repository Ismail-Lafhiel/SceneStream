import { useDarkMode } from "@/contexts/DarkModeContext";
import { FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { movieService } from "@/services/api";
import { Link } from "react-router-dom";
import { IMovie } from "@/interfaces";
import { MovieCard } from "../movie/MovieCard";



export const PopularTitles = () => {
  const { isDarkMode } = useDarkMode();
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [activeCategory, setActiveCategory] = useState("trending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await movieService.getGenres();
        const genreMap = genreList.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {} as Record<number, string>);
        setGenres(genreMap);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load genres");
      }
    };

    fetchGenres();
  }, []);

  // Fetch movies based on active category
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let data;

        switch (activeCategory) {
          case "trending":
            data = await movieService.getTrendingMovies();
            break;
          case "new":
            data = await movieService.getNewReleases();
            break;
          default:
            if (!isNaN(Number(activeCategory))) {
              data = await movieService.getMoviesByGenre(Number(activeCategory));
            } else {
              data = await movieService.getPopularMovies();
            }
        }

        // Limit to 10 movies and ensure they have poster images
        const filteredMovies = data.results
          .filter((movie) => movie.poster_path)
          .slice(0, 10);

        setMovies(filteredMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [activeCategory]);

  return (
    <section
      className={`py-16 transition-colors ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h2
              className={`text-3xl font-bold mb-2 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Popular Right Now
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Discover the most-watched titles this week
            </p>
          </div>
          <Link
            to="/browse"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              isDarkMode
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
            }`}
          >
            View All
            <FaInfoCircle className="text-sm" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("trending")}
            className={`category-tab cursor-pointer ${
              activeCategory === "trending" ? "active" : ""
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setActiveCategory("new")}
            className={`category-tab cursor-pointer ${
              activeCategory === "new" ? "active" : ""
            }`}
          >
            New Releases
          </button>
          {Object.entries(genres).map(([id, name]) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`category-tab cursor-pointer ${
                activeCategory === id ? "active" : ""
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="text-red-500 text-center py-8 rounded-lg bg-red-50 dark:bg-red-900/10">
            {error}
          </div>
        )}

        {/* Movies Grid */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} genres={genres} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PopularTitles;
