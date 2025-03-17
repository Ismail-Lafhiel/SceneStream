import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getTvShowById } from "@/services/TvshowService";
import { getGenres } from "@/services/GenreService";
import { Tv, Calendar, Tag, Star, Clock, Info, ArrowLeft } from "lucide-react";

const TvShowDetails = () => {
  const { id } = useParams(); // Get the TV show ID from the URL
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [tvShow, setTvShow] = useState(null);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch TV show details and genres when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tvShowResponse, genresResponse] = await Promise.all([
          getTvShowById(id),
          getGenres({ page: 1, limit: 100 }),
        ]);

        console.log("TV Show Data:", tvShowResponse);
        console.log("Genres Data:", genresResponse.results);

        setTvShow(tvShowResponse);
        setGenres(genresResponse.results || []);
      } catch (err) {
        setError(err.message || "Failed to fetch TV show details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [id, isAuthenticated]);

  // Navigate back to the TV shows list
  const handleBack = () => {
    navigate("/admin/tvshows");
  };

  // Redirect to login if not authenticated
  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: `/tvshows/${id}` } });
  };

  // Dynamic classes based on dark mode
  const bgClass = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const cardClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const labelClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonClass = isDarkMode
    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";
  const errorBgClass = isDarkMode ? "bg-red-900" : "bg-red-100";
  const errorTextClass = isDarkMode ? "text-red-200" : "text-red-800";
  const errorBorderClass = isDarkMode ? "border-red-800" : "border-red-400";

  return (
    <div
      className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-12">
        <div
          className={`max-w-4xl mx-auto ${cardClass} rounded-xl shadow-xl overflow-hidden transition-colors duration-300`}
        >
          <div
            className={`${
              isDarkMode ? "bg-indigo-900" : "bg-blue-600"
            } py-6 px-8`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tv className="mr-3 h-8 w-8 text-white" />
                <h1 className="text-3xl font-bold text-white">
                  TV Show Details
                </h1>
              </div>
              <button
                onClick={handleBack}
                className={`${buttonClass} font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 duration-200 flex items-center`}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </button>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div
                className={`${errorBgClass} border ${errorBorderClass} ${errorTextClass} px-4 py-3 rounded-lg mb-6 flex items-center`}
              >
                <span>{error}</span>
              </div>
            )}

            {!isAuthenticated ? (
              <div className="py-8 text-center">
                <div className="mb-6">
                  <Tv
                    className={`h-16 w-16 mx-auto ${
                      isDarkMode ? "text-indigo-400" : "text-blue-500"
                    }`}
                  />
                  <p className="mt-4 mb-6 text-lg">
                    You need to be logged in to view TV show details.
                  </p>
                  <button
                    onClick={handleLogin}
                    className={`${buttonClass} font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 duration-200 flex items-center mx-auto`}
                  >
                    <span>Log In to Continue</span>
                  </button>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* TV Show Poster */}
                {tvShow.poster_path && (
                  <div className="flex justify-center">
                    <img
                      src={tvShow.poster_path}
                      alt="TV Show Poster"
                      className="max-h-96 rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* TV Show Name */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Tv className="mr-2 h-4 w-4" />
                    Name
                  </label>
                  <div className="text-xl font-semibold">{tvShow.name}</div>
                </div>

                {/* First Air Date */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    First Air Date
                  </label>
                  <div className="text-lg">{tvShow.first_air_date}</div>
                </div>

                {/* Tagline */}
                {tvShow.tagline && (
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Tagline
                    </label>
                    <div className="text-lg italic">"{tvShow.tagline}"</div>
                  </div>
                )}

                {/* Overview */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Overview
                  </label>
                  <div className="text-lg">{tvShow.overview}</div>
                </div>

                {/* Genres Section */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.genre_ids?.map((genreObj) => {
                      // Extract the genre ID from the object
                      const genreId = genreObj.id;

                      // Find the matching genre in the genres list
                      const genre = genres.find((g) => g.id === genreId);

                      return (
                        <div
                          key={genreId}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            isDarkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          {genre ? genre.name : "Unknown Genre"}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Episode Runtime */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Episode Runtime
                  </label>
                  <div className="text-lg">
                    {tvShow.episode_run_time} minutes
                  </div>
                </div>

                {/* Number of Seasons and Episodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Number of Seasons
                    </label>
                    <div className="text-lg">{tvShow.number_of_seasons}</div>
                  </div>

                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Number of Episodes
                    </label>
                    <div className="text-lg">{tvShow.number_of_episodes}</div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Rating
                  </label>
                  <div className="text-lg">
                    {tvShow.vote_average} / 10 ({tvShow.vote_count} votes)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvShowDetails;
