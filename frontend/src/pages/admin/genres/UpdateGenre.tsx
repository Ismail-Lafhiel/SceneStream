//@ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getGenre, updateGenre } from "@/services/GenreService";
import { X, Tag } from "lucide-react";
import toast from "react-hot-toast";

const UpdateGenre = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch the genre data when the component mounts
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const genre = await getGenre(id);
        setFormData({ name: genre.name });
      } catch (err) {
        setError(err.message || "Failed to fetch genre");
        toast.error(err.message);
      }
    };

    if (isAuthenticated) {
      fetchGenre();
    }
  }, [id, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setError("Authentication required. Please log in.");
    }
  }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Call the service to update the genre
      const response = await updateGenre(id, formData);
      toast.success("Genre updated successfully!");
      navigate("/admin/genres");
    } catch (err) {
      setError(err.message || "Failed to update genre");
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: `/update-genre/${id}` } });
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
              <Tag className="mr-3 h-8 w-8 text-white" />
              <h1 className="text-3xl font-bold text-white">Update Genre</h1>
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
                  <Tag
                    className={`h-16 w-16 mx-auto ${
                      isDarkMode ? "text-blue-400" : "text-blue-500"
                    }`}
                  />
                  <p className="mt-4 mb-6 text-lg">
                    You need to be logged in to update a genre.
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
                {/* Genre Name */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Genre Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border focus:ring-2 ${
                      isDarkMode
                        ? "focus:ring-blue-500"
                        : "focus:ring-blue-500"
                    } focus:border-transparent transition-all duration-200`}
                    placeholder="Enter genre name"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`${buttonClass} cursor-pointer font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105 duration-200 flex items-center ${
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
                        <Tag className="mr-2 h-5 w-5" />
                        Update Genre
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

export default UpdateGenre;