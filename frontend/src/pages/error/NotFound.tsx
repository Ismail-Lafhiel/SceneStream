import { Link } from "react-router-dom";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="text-center space-y-6">
        <h1
          className={`text-9xl font-bold ${
            isDarkMode ? "text-gray-700" : "text-gray-200"
          }`}
        >
          404
        </h1>
        <h2
          className={`text-3xl font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Page Not Found
        </h2>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
