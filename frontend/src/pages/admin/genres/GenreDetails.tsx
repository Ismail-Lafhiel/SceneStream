//@ts-nocheck
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { getGenre } from "@/services/GenreService";
import { X, Tag, Edit, ArrowLeft } from "lucide-react";

const GenreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [genre, setGenre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch genre details when the component mounts
  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const genreData = await getGenre(id);
        setGenre(genreData);
      } catch (err) {
        setError(err.message || "Failed to fetch genre details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchGenre();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [id, isAuthenticated]);

  // Redirect to login if not authenticated
  const handleLogin = () => {
    navigate("/login", { state: { returnUrl: `/genres/${id}` } });
  };

  // Navigate back to the genres list
  const handleBack = () => {
    navigate("/admin/genres");
  };

  // Navigate to the edit genre page
  const handleEdit = () => {
    navigate(`/admin/genres/edit/${id}`);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag className="mr-3 h-8 w-8 text-white" />
                <h1 className="text-3xl font-bold text-white">Genre Details</h1>
              </div>
              <button
                onClick={handleBack}
                className={`${buttonClass} cursor-pointer font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105 duration-200 flex items-center`}
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
                    You need to be logged in to view genre details.
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
                {/* Genre Name */}
                <div>
                  <label
                    className={`block ${labelClass} text-sm font-medium mb-2 flex items-center`}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Genre Name
                  </label>
                  <div
                    className={`w-full px-4 py-3 rounded-lg ${inputBgClass} ${inputTextClass} ${inputBorderClass} border`}
                  >
                    {genre?.name}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleEdit}
                    className={`${buttonClass} font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105 duration-200 flex items-center`}
                  >
                    <Edit className="mr-2 h-5 w-5" />
                    Edit Genre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenreDetails;
