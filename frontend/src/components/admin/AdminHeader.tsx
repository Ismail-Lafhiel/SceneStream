import { useState, useEffect, useRef } from "react";
import { FaSearch, FaMoon, FaSun, FaUser, FaFilm } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const profileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search logic here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header
      className={`sticky top-0 py-3 px-6 ${
        isDarkMode
          ? "bg-gray-800 border-b border-gray-700"
          : "bg-white border-b border-gray-200"
      } shadow-sm flex justify-between items-center z-20`}
    >
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className={`relative ${
          isDarkMode ? "text-gray-300" : "text-gray-700"
        } w-full max-w-md`}
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FaSearch className="w-4 h-4 text-gray-400" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500"
          }`}
          placeholder="Search for movies, users..."
        />
      </form>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Add Movie Quick Button */}
        <Link to="/admin/movies/create">
          <button
            className={`p-2 rounded-full hidden md:flex items-center space-x-2 ${
              isDarkMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition-colors`}
          >
            <FaFilm className="w-4 h-4" />
            <span className="text-sm font-medium">Add Movie</span>
          </button>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            isDarkMode
              ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } transition-colors`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? (
            <FaSun className="w-5 h-5" />
          ) : (
            <FaMoon className="w-5 h-5" />
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-3 focus:outline-none"
            aria-label="Open user menu"
          >
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {user?.name?.charAt(0) || <FaUser className="w-5 h-5" />}
            </div>
            <div
              className={`hidden md:block ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <p className="text-sm font-medium">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </button>

          {isProfileMenuOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-30 overflow-hidden ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div
                className={`px-4 py-3 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
              <div className="py-1">
                <a
                  href="#profile"
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Your Profile
                </a>
                <a
                  href="#settings"
                  className={`block px-4 py-2 text-sm ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Settings
                </a>
                <button
                  onClick={() => {
                    signOut();
                    setIsProfileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm text-blue-500 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                  } hover:text-blue-600`}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
