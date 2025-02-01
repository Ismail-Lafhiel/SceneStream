// @ts-nocheck
import { useState, useEffect } from "react";
import { movieService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { MovieCard } from "@/components/movie/MovieCard";
import { motion } from "framer-motion";
import {
  FaFire,
  FaStar,
  FaClock,
  FaCalendar,
  FaChevronDown,
} from "react-icons/fa";
import { MovieSection } from "@/interfaces";

const Movies = () => {
  const { isDarkMode } = useDarkMode();
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<MovieSection[]>([
    {
      id: "popular",
      title: "Popular Movies",
      icon: <FaFire className="text-orange-500" />,
      description: "Most watched movies this week",
      movies: [],
      isLoading: true,
      page: 1,
      hasMore: true,
      fetchMovies: async (page) => {
        const data = await movieService.getPopularMovies(page);
        return data.results;
      },
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
      fetchMovies: async (page) => {
        const data = await movieService.getTopRatedMovies(page);
        return data.results;
      },
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
      fetchMovies: async (page) => {
        const data = await movieService.getNowPlayingMovies(page);
        return data.results;
      },
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
      fetchMovies: async (page) => {
        const data = await movieService.getUpcomingMovies(page);
        return data.results;
      },
    },
  ]);

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

  // Initial fetch for all sections
  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const updatedSections = await Promise.all(
          sections.map(async (section) => {
            try {
              const movies = await section.fetchMovies(1);
              return {
                ...section,
                movies,
                isLoading: false,
                hasMore: movies.length === 20,
              };
            } catch (error) {
              console.error(`Error fetching ${section.title}:`, error);
              return {
                ...section,
                isLoading: false,
                hasMore: false,
              };
            }
          })
        );
        setSections(updatedSections);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to load movies");
      }
    };

    fetchInitialMovies();
  }, []);

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
      const newMovies = await section.fetchMovies(section.page + 1);

      updatedSections[sectionIndex] = {
        ...section,
        movies: [...section.movies, ...newMovies],
        page: section.page + 1,
        isLoading: false,
        hasMore: newMovies.length === 20,
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center py-8 px-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen mt-5 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
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
            Discover the latest and greatest movies from around the
            world
          </p>
        </div>
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
                      section.isLoading ? "opacity-50 cursor-not-allowed" : ""
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
      </div>
    </div>
  );
};

export default Movies;
