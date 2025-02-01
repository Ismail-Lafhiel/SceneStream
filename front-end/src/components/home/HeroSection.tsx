import { Link } from "react-router-dom";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { IMovie, IPaginatedResponse } from "@/interfaces";

export const HeroSection = () => {
  const [featuredMovie, setFeaturedMovie] = useState<IMovie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${
            import.meta.env.VITE_APP_TMDB_API_KEY
          }&language=en-US&page=1`
        );
        const data: IPaginatedResponse<IMovie> = await response.json();
        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)];
        setFeaturedMovie(randomMovie);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedMovie();
    const intervalId = setInterval(fetchFeaturedMovie, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="relative min-h-[90vh] flex items-end pb-20 sm:items-center sm:pb-0">
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
        {featuredMovie ? (
          <img
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
            alt={featuredMovie.title}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 animate-pulse"></div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {featuredMovie ? (
            <>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/20 text-blue-400 backdrop-blur-sm mb-4">
                Featured Movie
              </span>
              <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight animate-fade-in mb-4">
                {featuredMovie.title}
              </h1>
              <div className="flex items-center gap-4 text-gray-300 mb-4 animate-fade-in-delay">
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
              <p className="text-lg text-gray-300 leading-relaxed mb-8 animate-fade-in-delay line-clamp-3 sm:line-clamp-none">
                {truncateText(featuredMovie.overview, 200)}
              </p>
            </>
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-8 w-32 bg-gray-700 rounded-full"></div>
              <div className="h-14 w-3/4 bg-gray-700 rounded-lg"></div>
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
              <div className="h-20 w-full bg-gray-700 rounded-lg"></div>
            </div>
          )}

          <div className="flex flex-wrap gap-4 animate-fade-in-delay-2">
            <Link
              to={featuredMovie ? `/movie/${featuredMovie.id}` : "/register"}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <FaPlay className="text-sm" />
              <span>Watch Now</span>
            </Link>
            <Link
              to={
                featuredMovie ? `/movie/${featuredMovie.id}/details` : "/browse"
              }
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
            >
              <FaInfoCircle />
              <span>More Info</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10"></div>
    </div>
  );
};
