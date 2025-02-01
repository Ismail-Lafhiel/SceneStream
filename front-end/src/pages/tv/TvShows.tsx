import { useState, useEffect } from "react";
import { tvService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TvShowCard } from "@/components/tv/TvShowCard";
import { ITVShow, IGenre, IPaginatedResponse } from "@/interfaces";
import { motion } from "framer-motion";
import {
  FaFire,
  FaStar,
  FaPlay,
  FaCalendar,
  FaChevronDown,
} from "react-icons/fa";

interface TvSection {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
  shows: ITVShow[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  fetchShows: (page: number) => Promise<IPaginatedResponse<ITVShow>>;
}

const TvShows = () => {
  const { isDarkMode } = useDarkMode();
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<TvSection[]>([
    {
      id: "popular",
      title: "Popular TV Shows",
      icon: <FaFire className="text-orange-500" />,
      description: "Most watched shows this week",
      shows: [],
      isLoading: true,
      page: 1,
      hasMore: true,
      fetchShows: tvService.getPopularTvShows,
    },
    {
      id: "topRated",
      title: "Top Rated",
      icon: <FaStar className="text-yellow-500" />,
      description: "Highest rated shows of all time",
      shows: [],
      isLoading: true,
      page: 1,
      hasMore: true,
      fetchShows: tvService.getTopRatedTvShows,
    },
    {
      id: "onAir",
      title: "Currently Airing",
      icon: <FaPlay className="text-blue-500" />,
      description: "Shows currently on air",
      shows: [],
      isLoading: true,
      page: 1,
      hasMore: true,
      fetchShows: tvService.getOnAirTvShows,
    },
    {
      id: "upcoming",
      title: "Upcoming Shows",
      icon: <FaCalendar className="text-green-500" />,
      description: "Shows premiering soon",
      shows: [],
      isLoading: true,
      page: 1,
      hasMore: true,
      fetchShows: tvService.getUpcomingTvShows,
    },
  ]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreList = await tvService.getTvGenres();
        const genreMap = genreList.reduce(
          (acc: Record<number, string>, genre: IGenre) => {
            acc[genre.id] = genre.name;
            return acc;
          },
          {}
        );
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
    const fetchInitialShows = async () => {
      try {
        const updatedSections = await Promise.all(
          sections.map(async (section) => {
            try {
              const response = await section.fetchShows(1);
              return {
                ...section,
                shows: response.results,
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
          })
        );
        setSections(updatedSections);
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setError("Failed to load TV shows");
      }
    };

    fetchInitialShows();
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
      const response = await section.fetchShows(section.page + 1);

      updatedSections[sectionIndex] = {
        ...section,
        shows: [...section.shows, ...response.results],
        page: response.page,
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
            TV Shows
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Discover the latest and greatest television series from around the
            world
          </p>
        </div>

        {/* TV Show Sections */}
        <div className="space-y-16">
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
                {section.shows.length === 0 && section.isLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-[2/3] rounded-xl bg-gray-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {section.shows.map((show) => (
                      <TvShowCard key={show.id} show={show} genres={genres} />
                    ))}
                  </div>
                )}

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
    </div>
  );
};

export default TvShows;
