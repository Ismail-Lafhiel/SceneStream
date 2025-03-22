//@ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { updateMovie, getMovieById } from "@/services/MovieService";
import { getGenres } from "@/services/GenreService";
import {
  Camera,
  Film,
  Calendar,
  Upload,
  X,
  Tag,
  Star,
  Clock,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

const UpdateMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    release_date: "",
    poster_path: null,
    backdrop_path: null,
    genre_ids: [],
    tagline: "",
    status: "Unreleased",
    runtime: "",
    vote_average: 0,
    vote_count: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [posterPreview, setPosterPreview] = useState(null);
  const [backdropPreview, setBackdropPreview] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  // Fetch available genres and existing movie data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genresResponse, movieResponse] = await Promise.all([
          getGenres({ page: 1, limit: 100 }),
          getMovieById(id),
        ]);

        const genresData = genresResponse.results || [];
        setGenres(genresData);

        if (movieResponse) {
          setFormData({
            title: movieResponse.title,
            overview: movieResponse.overview,
            release_date: movieResponse.release_date,
            poster_path: movieResponse.poster_path,
            backdrop_path: movieResponse.backdrop_path,
            genre_ids: movieResponse.genre_ids,
            tagline: movieResponse.tagline,
            status: movieResponse.status,
            runtime: movieResponse.runtime,
            vote_average: movieResponse.vote_average,
            vote_count: movieResponse.vote_count,
          });

          setSelectedGenres(movieResponse.genre_ids);
          setPosterPreview(movieResponse.poster_path);
          setBackdropPreview(movieResponse.backdrop_path);
        }
      } catch (err) {
        // console.error("Failed to fetch data", err);
        setError("Failed to load data. Please try again later.");
        toast.error("Failed to load data. Please try again later.");
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

    if (
      name === "runtime" ||
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
      formDataToSend.append("title", formData.title);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("release_date", formData.release_date);
      formDataToSend.append("tagline", formData.tagline);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("runtime", formData.runtime);
      formDataToSend.append("vote_average", formData.vote_average);
      formDataToSend.append("vote_count", formData.vote_count);

      // Append genre_ids as an array of numbers
      selectedGenres.forEach((genre) => {
        formDataToSend.append("genre_ids[]", genre.id);
      });

      // Append image files if they exist
      if (formData.poster_path) {
        formDataToSend.append("poster_path", formData.poster_path);
      }
      if (formData.backdrop_path) {
        formDataToSend.append("backdrop_path", formData.backdrop_path);
      }

      // Log the payload for debugging
      console.log([...formDataToSend.entries()]);

      // Send the request
      const response = await updateMovie(id, formDataToSend);
      toast.success("Movie updated successfully");
      navigate("/admin/movies");
    } catch (err) {
      setError(err.message || "Failed to update movie");
      toast.error(err.message || "Failed to update movie");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: `/update-movie/${id}` } });
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
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";
  const errorBgClass = isDarkMode ? "bg-red-900" : "bg-red-100";
  const errorTextClass = isDarkMode ? "text-red-200" : "text-red-800";
  const errorBorderClass = isDarkMode ? "border-red-800" : "border-red-400";
  const chipClass = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const activeChipClass = isDarkMode
    ? "bg-blue-600 text-white"
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
              isDarkMode ? "bg-blue-900" : "bg-blue-600"
            } py-6 px-8`}
          >
            <div className="flex items-center">
              <Film className="mr-3 h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Update Movie</h1>
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
                  <Film
                    className={`h-16 w-16 mx-auto ${
                      isDarkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <p className="mt-4 mb-6 text-lg">
                    You need to be logged in to update a movie.
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
                      <Film className="mr-2 h-4 w-4" />
                      Movie Title <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-blue-500"
                          : "focus:ring-blue-500"
                      } focus:border-transparent transition-all duration-200`}
                      placeholder="Enter movie title"
                      required
                    />
                  </div>

                  <div>
                    <label
                      className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Release Date
                    </label>
                    <input
                      type="date"
                      name="release_date"
                      value={formData.release_date}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-blue-500"
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
                          ? "focus:ring-blue-500"
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
                            ? "focus:ring-blue-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent transition-all duration-200`}
                      >
                        <option value="Unreleased">Unreleased</option>
                        <option value="Released">Released</option>
                        <option value="In Production">In Production</option>
                        <option value="Post Production">Post Production</option>
                        <option value="Planned">Planned</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Runtime (min)
                      </label>
                      <input
                        type="number"
                        name="runtime"
                        value={formData.runtime}
                        onChange={handleChange}
                        min="0"
                        className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                          isDarkMode
                            ? "focus:ring-blue-500"
                            : "focus:ring-blue-500"
                        } focus:border-transparent transition-all duration-200`}
                        placeholder="120"
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
                        ? "focus:ring-blue-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all duration-200 h-32 resize-none`}
                    placeholder="Write a brief overview of the movie..."
                    required
                  />
                </div>

                {/* Movie Genres */}
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
                          ? "focus:ring-blue-500"
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
                          ? "focus:ring-blue-500"
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
                      Movie Poster
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
                        <Film className="mr-2 h-5 w-5" />
                        Update Movie
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

export default UpdateMovie;
