import { useState, useEffect, useCallback, useRef } from "react";
import { movieService, tvService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { MovieCard } from "@/components/movie/MovieCard";
import { TvShowCard } from "@/components/tv/TvShowCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  IMovie,
  ITVShow,
  IGenre,
  FilterOption,
  MediaType,
  SortBy,
} from "@/interfaces";
import {
  FaSearch,
  FaTimes,
  FaChevronDown,
  FaFilm,
  FaTv,
  FaGlobe,
} from "react-icons/fa";

// Filter options
const mediaTypeOptions: FilterOption[] = [
  { value: "all", label: "All", icon: <FaGlobe /> },
  { value: "movie", label: "Movies", icon: <FaFilm /> },
  { value: "tv", label: "TV Shows", icon: <FaTv /> },
];

const sortOptions: FilterOption[] = [
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "release_date", label: "Release Date" },
  { value: "title", label: "Title A-Z" },
];

const Browse = () => {
  // State management
  const { isDarkMode } = useDarkMode();
  const [mediaType, setMediaType] = useState<MediaType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [tvShows, setTvShows] = useState<ITVShow[]>([]);
  const [movieGenres, setMovieGenres] = useState<IGenre[]>([]);
  const [tvGenres, setTvGenres] = useState<IGenre[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [heroMovie, setHeroMovie] = useState<IMovie | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current) {
        const filterTop = filterRef.current.getBoundingClientRect().top;
        setIsFilterSticky(filterTop <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const { results } = await movieService.getPopularMovies(1);
        // Get a random movie from the top 5 popular movies
        const randomMovie = results[Math.floor(Math.random() * 5)];
        setHeroMovie(randomMovie);
      } catch (error) {
        console.error("Error fetching hero movie:", error);
      }
    };

    fetchHeroMovie();
  }, []);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenreList, tvGenreList] = await Promise.all([
          movieService.getGenres(),
          tvService.getTvGenres(),
        ]);
        setMovieGenres(movieGenreList);
        setTvGenres(tvGenreList);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to load genres");
      }
    };

    fetchGenres();
  }, []);

  // Helper function to get sort value
  const getSortByValue = (sort: SortBy): string => {
    switch (sort) {
      case "popularity":
        return "popularity.desc";
      case "rating":
        return "vote_average.desc";
      case "release_date":
        return "release_date.desc";
      case "title":
        return "title.asc";
      default:
        return "popularity.desc";
    }
  };

  // Fetch content based on filters
  const fetchContent = useCallback(
    async (resetPage = false) => {
      try {
        setIsLoading(true);
        setError(null);
        const currentPage = resetPage ? 1 : page;

        let movieResults: IMovie[] = [];
        let tvResults: ITVShow[] = [];
        let totalMovies = 0;
        let totalTvShows = 0;

        if (mediaType === "all" || mediaType === "movie") {
          const movieData = await movieService.discoverMovies({
            page: currentPage,
            with_genres: selectedGenre,
            sort_by: getSortByValue(sortBy),
            search: searchQuery,
          });
          movieResults = movieData.results;
          totalMovies = movieData.total_results;
          setHasMore(currentPage < movieData.total_pages);
        }

        if (mediaType === "all" || mediaType === "tv") {
          const tvData = await tvService.discoverTvShows({
            page: currentPage,
            with_genres: selectedGenre,
            sort_by: getSortByValue(sortBy),
            search: searchQuery,
          });
          tvResults = tvData.results;
          totalTvShows = tvData.total_results;
          setHasMore(currentPage < tvData.total_pages);
        }

        setTotalResults(totalMovies + totalTvShows);

        if (resetPage) {
          setMovies(movieResults);
          setTvShows(tvResults);
          setPage(1);
        } else {
          setMovies((prev) => [...prev, ...movieResults]);
          setTvShows((prev) => [...prev, ...tvResults]);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    },
    [mediaType, selectedGenre, sortBy, searchQuery, page]
  );

  // Initial fetch and filter changes
  useEffect(() => {
    fetchContent(true);
  }, [mediaType, selectedGenre, sortBy]);

  // Search handler with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchContent(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchContent(false);
    }
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Hero Section */}
      <div className="relative h-[550px] overflow-hidden">
        {/* Background Image */}
        {heroMovie && (
          <div className="absolute inset-0">
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
              alt={heroMovie.title}
              className="w-full h-full object-fill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-gray-900/50" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-transparent to-gray-900/50" />
          </div>
        )}

        {/* Content */}
        <div className="relative h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl font-bold text-white mb-6"
              >
                Discover Amazing Content
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-200 mb-12"
              >
                Browse through thousands of movies and TV shows, filter by
                genre, and find your next favorite entertainment
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative max-w-2xl mx-auto"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for movies or TV shows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full px-6 py-2.5 pl-14 text-lg rounded-full shadow-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      isDarkMode
                        ? "bg-gray-900/80 text-white placeholder-gray-400 backdrop-blur-sm"
                        : "bg-white/90 text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                    }`}
                  />
                  <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div
        ref={filterRef}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isFilterSticky
            ? `${
                isDarkMode ? "bg-gray-900/95" : "bg-gray-50/95"
              } shadow-lg backdrop-blur-sm`
            : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Media Type Tabs */}
            <div className="flex rounded-lg overflow-hidden shadow-sm">
              {mediaTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMediaType(option.value as MediaType)}
                  className={`flex items-center gap-2 px-4 py-2 transition-colors ${
                    mediaType === option.value
                      ? isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-white text-blue-600"
                      : isDarkMode
                      ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>

            {/* Genre Select */}
            <select
              value={selectedGenre || ""}
              onChange={(e) => setSelectedGenre(Number(e.target.value) || null)}
              className={`px-4 py-2 rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-200"
              }`}
            >
              <option value="">All Genres</option>
              {mediaType !== "tv" &&
                movieGenres.map((genre) => (
                  <option key={`movie-${genre.id}`} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              {mediaType !== "movie" &&
                tvGenres.map((genre) => (
                  <option key={`tv-${genre.id}`} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
            </select>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className={`px-4 py-2 rounded-lg shadow-sm ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-gray-900 border-gray-200"
              }`}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div
              className={`ml-auto text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {totalResults} results found
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          >
            {movies.map((movie) => (
              <MovieCard
                key={`movie-${movie.id}`}
                movie={movie}
                genres={movieGenres.reduce((acc, genre) => {
                  acc[genre.id] = genre.name;
                  return acc;
                }, {} as Record<number, string>)}
              />
            ))}
            {tvShows.map((show) => (
              <TvShowCard
                key={`tv-${show.id}`}
                show={show}
                genres={tvGenres.reduce((acc, genre) => {
                  acc[genre.id] = genre.name;
                  return acc;
                }, {} as Record<number, string>)}
              />
            ))}
            {isLoading &&
              [...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"
                />
              ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More */}
        {hasMore && !isLoading && (movies.length > 0 || tvShows.length > 0) && (
          <div className="flex justify-center pt-12">
            <button
              onClick={loadMore}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg text-lg font-medium transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <FaChevronDown className="text-sm" />
              Load More
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && movies.length === 0 && tvShows.length === 0 && (
          <div className="text-center py-12">
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No results found. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
