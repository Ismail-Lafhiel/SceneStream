import { useDarkMode } from "@/contexts/DarkModeContext";
import { FaPlay, FaStar, FaInfoCircle, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { movieService } from "@/services/api";
import { Link } from "react-router-dom";
import { IMovie } from "@/interfaces";
import { TrailerModal } from "@/components/common/TrailerModal";

const MovieCard = ({
  movie,
  genres,
}: {
  movie: IMovie;
  genres: Record<number, string>;
}) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/path-to-fallback-image.jpg";

  const movieGenre = movie.genre_ids[0]
    ? genres[movie.genre_ids[0]]
    : "Unknown";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="relative group"
        layout
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 cursor-pointer">
          <Link to={`/movie/${movie.id}/details`} className="block w-full h-full">
            <img
              src={imageUrl}
              alt={movie.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Hover Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-white text-sm font-medium">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            {/* Movie Info */}
            <div className="space-y-3">
              <Link to={`/movie/${movie.id}/details`}>
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 hover:text-blue-400 transition-colors cursor-pointer">
                  {movie.title}
                </h3>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <FaClock className="text-xs" />
                  {new Date(movie.release_date).getFullYear()}
                </span>
                <span>•</span>
                <span>{movieGenre}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 cursor-pointer"
                >
                  <FaPlay size={12} />
                  Play Trailer
                </button>
                <Link
                  to={`/movie/${movie.id}/details`}
                  className="p-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <FaInfoCircle size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <TrailerModal
        movieId={movie.id}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
      />
    </>
  );
};

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
