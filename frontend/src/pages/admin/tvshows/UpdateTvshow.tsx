import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { updateTvShow, getTvShowById } from "@/services/TvShowService";
import { getGenres } from "@/services/GenreService";
import {
  Camera,
  Tv,
  Calendar,
  Upload,
  X,
  Tag,
  Star,
  Clock,
  Info,
} from "lucide-react";

const UpdateTvShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
    overview: "",
    first_air_date: "",
    poster_path: null,
    backdrop_path: null,
    genre_ids: [],
    tagline: "",
    status: "Returning Series",
    episode_run_time: "",
    number_of_seasons: "",
    number_of_episodes: "",
    vote_average: 0,
    vote_count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [posterPreview, setPosterPreview] = useState(null);
  const [backdropPreview, setBackdropPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch available genres and existing TV show data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresResponse, tvShowResponse] = await Promise.all([
          getGenres({ page: 1, limit: 100 }),
          getTvShowById(id),
        ]);

        const genresData = genresResponse.results || [];
        setGenres(genresData);

        if (tvShowResponse) {
          setFormData({
            name: tvShowResponse.name || "",
            overview: tvShowResponse.overview || "",
            first_air_date: tvShowResponse.first_air_date || "",
            poster_path: tvShowResponse.poster_path || null,
            backdrop_path: tvShowResponse.backdrop_path || null,
            genre_ids: tvShowResponse.genre_ids || [],
            tagline: tvShowResponse.tagline || "",
            status: tvShowResponse.status || "Returning Series",
            episode_run_time: tvShowResponse.episode_run_time || "",
            number_of_seasons: tvShowResponse.number_of_seasons || "",
            number_of_episodes: tvShowResponse.number_of_episodes || "",
            vote_average: tvShowResponse.vote_average || 0,
            vote_count: tvShowResponse.vote_count || 0,
          });

          setSelectedGenres(tvShowResponse.genre_ids || []);
          setPosterPreview(tvShowResponse.poster_path);
          setBackdropPreview(tvShowResponse.backdrop_path);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle numeric fields
    if (
      name === "episode_run_time" ||
      name === "number_of_seasons" ||
      name === "number_of_episodes" ||
      name === "vote_average" ||
      name === "vote_count"
    ) {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      [e.target.name]: file,
    });

    // Create preview URL
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (e.target.name === "poster_path") {
        setPosterPreview(previewUrl);
      } else if (e.target.name === "backdrop_path") {
        setBackdropPreview(previewUrl);
      }
    }
  };

  const removeImage = (type) => {
    if (type === "poster") {
      setPosterPreview(null);
      setFormData({ ...formData, poster_path: null });
    } else {
      setBackdropPreview(null);
      setFormData({ ...formData, backdrop_path: null });
    }
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genreId)) {
        return prevSelected.filter((id) => id !== genreId);
      } else {
        return [...prevSelected, genreId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("first_air_date", formData.first_air_date);
      formDataToSend.append("tagline", formData.tagline);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("episode_run_time", formData.episode_run_time);
      formDataToSend.append("number_of_seasons", formData.number_of_seasons);
      formDataToSend.append("number_of_episodes", formData.number_of_episodes);
      formDataToSend.append("vote_average", formData.vote_average);
      formDataToSend.append("vote_count", formData.vote_count);

      // Append genre_ids as an array of numbers
      selectedGenres.forEach((genreId) => {
        formDataToSend.append("genre_ids[]", genreId);
      });

      // Append image files if they exist
      if (formData.poster_path instanceof File) {
        formDataToSend.append("poster_path", formData.poster_path);
      }
      if (formData.backdrop_path instanceof File) {
        formDataToSend.append("backdrop_path", formData.backdrop_path);
      }

      // Send the request
      await updateTvShow(id, formDataToSend);
      navigate("/admin/tvshows");
    } catch (err) {
      setError(err.message || "Failed to update TV show");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: `/update-tvshow/${id}` } });
  };

  // Dynamic classes based on dark mode
  const bgClass = isDarkMode ? "bg-gray-900" : "bg-gray-50";
  const textClass = isDarkMode ? "text-white" : "text-gray-800";
  const cardClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const inputBgClass = isDarkMode ? "bg-gray-700" : "bg-white";
  const inputTextClass = isDarkMode ? "text-gray-200" : "text-gray-800";
  const inputBorderClass = isDarkMode ? "border-gray-600" : "border-gray-300";
  const labelClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonClass = isDarkMode
    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";
  const errorBgClass = isDarkMode ? "bg-red-900" : "bg-red-100";
  const errorTextClass = isDarkMode ? "text-red-200" : "text-red-800";
  const errorBorderClass = isDarkMode ? "border-red-800" : "border-red-400";
  const chipClass = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const activeChipClass = isDarkMode
    ? "bg-indigo-600 text-white"
    : "bg-blue-600 text-white";

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
            <div className="flex items-center">
              <Tv className="mr-3 h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Update TV Show</h1>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div
                className={`${errorBgClass} border ${errorBorderClass} ${errorTextClass} px-4 py-3 rounded-lg mb-6 flex items-center`}
              >
                <X className="mr-2" />
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
                    You need to be logged in to update a TV show.
                  </p>
                  <button
                    onClick={handleLogin}
                    className={`${buttonClass} font-semibold py-3 px-6 rounded-lg transition transform hover:scale-105 duration-200 flex items-center mx-auto`}
                  >
                    <span>Log In to Continue</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Tv className="mr-2 h-4 w-4" />
                      TV Show Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="Enter TV show name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      First Air Date
                    </label>
                    <input
                      type="date"
                      name="first_air_date"
                      value={formData.first_air_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                    />
                  </div>
                </div>

                {/* Tagline & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={formData.tagline}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="A catchy tagline"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                      >
                        <Info className="mr-2 h-4 w-4" />
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                          isDarkMode
                            ? "focus:ring-indigo-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent transition-all duration-200`}
                      >
                        <option value="Returning Series">
                          Returning Series
                        </option>
                        <option value="Ended">Ended</option>
                        <option value="In Production">In Production</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Episode Runtime (min)
                      </label>
                      <input
                        type="number"
                        name="episode_run_time"
                        value={formData.episode_run_time}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                          isDarkMode
                            ? "focus:ring-indigo-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent transition-all duration-200`}
                        placeholder="45"
                      />
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Overview <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                      isDarkMode
                        ? "focus:ring-indigo-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all duration-200 h-32 resize-none`}
                    placeholder="Write a brief overview of the TV show..."
                    required
                  />
                </div>

                {/* TV Show Genres */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre._id}
                        type="button"
                        onClick={() => toggleGenre(genre.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                          selectedGenres.includes(genre.id)
                            ? activeChipClass
                            : chipClass
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Rating (0-10)
                    </label>
                    <input
                      type="number"
                      name="vote_average"
                      value={formData.vote_average}
                      onChange={handleChange}
                      min="0"
                      max="10"
                      step="0.1"
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Vote Count
                    </label>
                    <input
                      type="number"
                      name="vote_count"
                      value={formData.vote_count}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Poster Upload */}
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Poster Image
                    </label>
                    <div
                      className={`relative border-2 border-dashed ${inputBorderClass} rounded-lg p-4 text-center ${
                        !posterPreview ? "hover:border-blue-500" : ""
                      }`}
                    >
                      {posterPreview ? (
                        <div className="relative">
                          <img
                            src={posterPreview}
                            alt="Poster Preview"
                            className="max-h-48 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("poster")}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-6">
                          <Upload
                            className={`h-10 w-10 mx-auto ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                          <p
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } mt-2`}
                          >
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs mt-1 text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        name="poster_path"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                        style={{ zIndex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Backdrop Upload */}
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Backdrop Image
                    </label>
                    <div
                      className={`relative border-2 border-dashed ${inputBorderClass} rounded-lg p-4 text-center ${
                        !backdropPreview ? "hover:border-blue-500" : ""
                      }`}
                    >
                      {backdropPreview ? (
                        <div className="relative">
                          <img
                            src={backdropPreview}
                            alt="Backdrop Preview"
                            className="max-h-48 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("backdrop")}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="py-6">
                          <Upload
                            className={`h-10 w-10 mx-auto ${
                              isDarkMode ? "text-gray-500" : "text-gray-400"
                            }`}
                          />
                          <p
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            } mt-2`}
                          >
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs mt-1 text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        name="backdrop_path"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer"
                        style={{ zIndex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Seasons and Episodes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Number of Seasons
                    </label>
                    <input
                      type="number"
                      name="number_of_seasons"
                      value={formData.number_of_seasons}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Number of Episodes
                    </label>
                    <input
                      type="number"
                      name="number_of_episodes"
                      value={formData.number_of_episodes}
                      onChange={handleChange}
                      min="0"
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-indigo-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${buttonClass} font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105 duration-200 flex items-center ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Tv className="mr-2 h-5 w-5" />
                        Update TV Show
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTvShow;
