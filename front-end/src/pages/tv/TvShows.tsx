// @ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { tvService } from "@/services/api";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { TvShowCard } from "@/components/tv/TvShowCard";
import { ITVShow, IGenre, IPaginatedResponse } from "@/interfaces";
import { motion, AnimatePresence } from "framer-motion";
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

const initialSections: TvSection[] = [
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
];

const TvShows = () => {
  const { isDarkMode } = useDarkMode();
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<TvSection[]>(initialSections);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState<
    Record<string, boolean>
  >({});

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

  // Fetch shows for a single section
  const fetchSectionShows = useCallback(async (section: TvSection) => {
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
  }, []);

  // Initial fetch for all sections
  useEffect(() => {
    const fetchInitialShows = async () => {
      try {
        setIsInitialLoading(true);
        const updatedSections = [...sections];

        for (let i = 0; i < sections.length; i++) {
          const updatedSection = await fetchSectionShows(sections[i]);
          updatedSections[i] = updatedSection;
          setSections([...updatedSections]);
        }
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        setError("Failed to load TV shows");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialShows();
  }, [fetchSectionShows]);

  const loadMore = async (sectionId: string) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    if (sectionIndex === -1) return;

    const section = sections[sectionIndex];
    if (loadingSections[sectionId] || !section.hasMore) return;

    setLoadingSections((prev) => ({ ...prev, [sectionId]: true }));

    try {
      const nextPage = section.page + 1;
      const response = await section.fetchShows(nextPage);

      const updatedSections = [...sections];
      updatedSections[sectionIndex] = {
        ...section,
        shows: [...section.shows, ...response.results],
        page: nextPage,
        hasMore: response.page < response.total_pages,
      };
      setSections(updatedSections);
    } catch (error) {
      console.error(`Error loading more ${section.title}:`, error);
    } finally {
      setLoadingSections((prev) => ({ ...prev, [sectionId]: false }));
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
    <div className="relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
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
        <div className={`p-8 rounded-2xl backdrop-blur-sm mb-8`}>
          <h1
            className={`text-4xl font-extrabold tracking-tight mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            TV Shows
          </h1>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Discover the latest and greatest television series from around the
            world
          </p>
        </div>

        {/* TV Show Sections */}
        <div className="space-y-8">
          <AnimatePresence>
            {sections.map((section, index) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl backdrop-blur-sm ${
                  isDarkMode
                    ? "bg-gray-800/40 border border-blue-500/20"
                    : "bg-white/80 border border-blue-200"
                }`}
              >
                <div className="space-y-4">
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
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {section.description}
                  </p>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {section.shows.map((show) => (
                      <TvShowCard key={show.id} show={show} genres={genres} />
                    ))}
                    {loadingSections[section.id] &&
                      [...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[2/3] rounded-xl bg-gray-800/50 backdrop-blur-sm animate-pulse"
                        />
                      ))}
                  </div>

                  {section.hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => loadMore(section.id)}
                        disabled={loadingSections[section.id]}
                        className={`flex items-center gap-2 px-8 py-2 cursor-pointer rounded-full font-medium transition-all duration-300 backdrop-blur-sm 
                          ${
                            isDarkMode
                              ? "bg-transparent hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                              : "bg-transparent hover:bg-blue-700 hover:text-white text-gray-800 shadow-lg shadow-blue-500/20"
                          } 
                          ${
                            loadingSections[section.id]
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:scale-105"
                          }`}
                      >
                        {loadingSections[section.id] ? (
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

export default TvShows;
