// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { movieService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { MovieCard } from "@/components/movie/MovieCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFire,
  FaStar,
  FaClock,
  FaCalendar,
  FaChevronDown,
} from "react-icons/fa";
import { MovieSection } from "@/interfaces";

const initialSections: MovieSection[] = [
  {
    id: "popular",
    title: "Popular Movies",
    icon: <FaFire className="text-orange-500" />,
    description: "Most watched movies this week",
    movies: [],
    isLoading: true,
    page: 1,
    hasMore: true,
    fetchMovies: movieService.getPopularMovies,
  },
  {
    id: "topRated",
    title: "Top Rated",
    icon: <FaStar className="text-yellow-500" />,
    description: "Highest rated movies of all time",
    movies: [],
    isLoading: true,
    page: 1,
    hasMore: true,
    fetchMovies: movieService.getTopRatedMovies,
  },
  {
    id: "nowPlaying",
    title: "Now Playing",
    icon: <FaClock className="text-blue-500" />,
    description: "Currently in theaters",
    movies: [],
    isLoading: true,
    page: 1,
    hasMore: true,
    fetchMovies: movieService.getNowPlayingMovies,
  },
  {
    id: "upcoming",
    title: "Upcoming Releases",
    icon: <FaCalendar className="text-green-500" />,
    description: "Coming soon to theaters",
    movies: [],
    isLoading: true,
    page: 1,
    hasMore: true,
    fetchMovies: movieService.getUpcomingMovies,
  },
];

const Movies = () => {
  const { isDarkMode } = useDarkMode();
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<MovieSection[]>(initialSections);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch genres
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

  // Fetch movies for a single section
  const fetchSectionMovies = useCallback(async (section: MovieSection) => {
    try {
      const response = await section.fetchMovies(1);
      return {
        ...section,
        movies: response.results,
        isLoading: false,
        hasMore: response.page < response.total_pages,
      };
    } catch (error) {
      console.error(`Error fetching ${section.title}:`, error);
      return {
        ...section,
        isLoading: false,
        hasMore: false,
      };
    }
  }, []);

  // Initial fetch for all sections
  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        setIsInitialLoading(true);
        const updatedSections = [...sections];

        // Fetch movies for each section sequentially
        for (let i = 0; i < sections.length; i++) {
          const updatedSection = await fetchSectionMovies(sections[i]);
          updatedSections[i] = updatedSection;
          setSections([...updatedSections]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialMovies();
  }, [fetchSectionMovies]);

  const loadMore = async (sectionId: string) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    if (section.isLoading || !section.hasMore) return;

    const updatedSections = [...sections];
    updatedSections[sectionIndex] = {
      ...section,
      isLoading: true,
    };
    setSections(updatedSections);

    try {
      const response = await section.fetchMovies(section.page + 1);

      updatedSections[sectionIndex] = {
        ...section,
        movies: [...section.movies, ...response.results],
        page: section.page + 1,
        isLoading: false,
        hasMore: response.page < response.total_pages,
      };
      setSections(updatedSections);
    } catch (error) {
      console.error(`Error loading more ${section.title}:`, error);
      updatedSections[sectionIndex] = {
        ...section,
        isLoading: false,
        hasMore: false,
      };
      setSections(updatedSections);
    }
  };

  return (
    <div
      className={`min-h-screen pt-5 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-16">
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Movies
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover the latest and greatest movies from around the world
          </p>
        </div>

        {/* Movie Sections */}
        <div className="space-y-16">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <h2
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {section.title}
                    </h2>
                  </div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {section.description}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {section.movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} genres={genres} />
                    ))}
                    {section.isLoading &&
                      [...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"
                        />
                      ))}
                  </div>

                  {section.hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => loadMore(section.id)}
                        disabled={section.isLoading}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                          isDarkMode
                            ? "bg-gray-800 hover:bg-gray-700 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                        } ${
                          section.isLoading
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {section.isLoading ? (
                          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <FaChevronDown className="text-sm" />
                            Load More
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Movies;
