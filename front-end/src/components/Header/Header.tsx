import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaPlay,
  FaSearch,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaUser,
  FaFilm,
  FaTv,
  FaDollarSign,
  FaChevronDown,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const useClickOutside = (handler: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
};

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const profileDropdownRef = useClickOutside(() => setIsProfileMenuOpen(false));
  const mobileMenuRef = useClickOutside(() => setIsMenuOpen(false));

  const navigationItems = [
    {
      path: "/browse",
      label: "Browse",
      icon: <FaSearch className="h-3 w-3" />,
    },
    { path: "/movies", label: "Movies", icon: <FaFilm className="h-3 w-3" /> },
    { path: "/tv", label: "TV Shows", icon: <FaTv className="h-3 w-3" /> },
    {
      path: "/pricing",
      label: "Pricing",
      icon: <FaDollarSign className="h-3 w-3" />,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsProfileMenuOpen(false);
      navigate("/login");
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const isHomePage = location.pathname === "/";
  const shouldBeTransparent = !isScrolled && isHomePage;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || !shouldBeTransparent
          ? isDarkMode
            ? "bg-gray-900/80 backdrop-blur-md border-b border-blue-500/20"
            : "bg-white/80 backdrop-blur-md border-b border-blue-200"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="group relative flex items-center transition-transform hover:scale-105"
              aria-label="SceneStream Home"
            >
              {/* Main Text */}
              <h1 className="relative text-3xl font-black tracking-tight">
                {/* First part of text with Netflix-style gradient */}
                <span className={`bg-gradient-to-b bg-clip-text text-transparent transition-all duration-300 ${isDarkMode ? "from-white to-gray-300 group-hover:from-white" : "from-gray-900 to-gray-600 group-hover:from-gray-900"}`}>
                  Scene
                </span>
                {/* Second part of text */}
                <span className="bg-gradient-to-b from-blue-600 to-blue-700 bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-800">
                  Stream
                </span>

                {/* Netflix-style shine effect */}
                <span className="absolute left-0 top-0 h-full w-full overflow-hidden">
                  <span className="absolute -left-full top-0 h-full w-full animate-[shine_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-12" />
                </span>
              </h1>

              {/* Bottom shadow effect */}
              <div className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-transparent via-blue-600/50 to-transparent opacity-50 blur-sm" />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                      : isDarkMode
                      ? "text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
                      : "text-gray-700 hover:bg-gray-100/50 backdrop-blur-sm"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Profile/Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileMenu}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
                      : "text-gray-700 hover:bg-gray-100/50 backdrop-blur-sm"
                  }`}
                >
                  <FaUser className="h-5 w-5" />
                  <span>{user?.name || "User"}</span>
                  <FaChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 border backdrop-blur-md ${
                        isDarkMode
                          ? "bg-gray-800/90 border-blue-500/20"
                          : "bg-white/90 border-blue-200"
                      }`}
                    >
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-700/50"
                            : "text-gray-700 hover:bg-gray-100/50"
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/bookmarks"
                        className={`block px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-700/50"
                            : "text-gray-700 hover:bg-gray-100/50"
                        }`}
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Bookmarks
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          isDarkMode
                            ? "text-gray-200 hover:bg-gray-700/50"
                            : "text-gray-700 hover:bg-gray-100/50"
                        }`}
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    isDarkMode
                      ? "text-gray-200 hover:bg-gray-800/50"
                      : "text-gray-700 hover:bg-gray-100/50"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                >
                  Start Free Trial
                </Link>
              </>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
                  : "text-gray-700 hover:bg-gray-100/50 backdrop-blur-sm"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Buttons */}
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
                  : "text-gray-700 hover:bg-gray-100/50 backdrop-blur-sm"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode
                  ? "text-gray-200 hover:bg-gray-800/50 backdrop-blur-sm"
                  : "text-gray-700 hover:bg-gray-100/50 backdrop-blur-sm"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden overflow-hidden backdrop-blur-md rounded-b-xl border-t ${
                isDarkMode ? "border-blue-500/20" : "border-blue-200"
              }`}
            >
              <div className="px-4 py-4 space-y-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search movies & shows"
                    className={`w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800/50 text-white border border-gray-700/50 focus:border-blue-500/50"
                        : "bg-white/50 text-gray-900 border border-gray-200/50 focus:border-blue-500/50"
                    }`}
                  />
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                        : isDarkMode
                        ? "text-gray-200 hover:bg-gray-800/50"
                        : "text-gray-700 hover:bg-gray-100/50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      className={`block px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-gray-800/50"
                          : "text-gray-700 hover:bg-gray-100/50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className={`block px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-gray-800/50"
                          : "text-gray-700 hover:bg-gray-100/50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-full text-base font-medium transition-all duration-300 ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-gray-800/50"
                          : "text-gray-700 hover:bg-gray-100/50"
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className={`block w-full px-4 py-2 rounded-full text-base font-medium text-center transition-all duration-300 ${
                        isDarkMode
                          ? "text-gray-200 hover:bg-gray-800/50"
                          : "text-gray-700 hover:bg-gray-100/50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full bg-blue-600 text-white px-4 py-2 rounded-full text-base font-medium text-center hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Start Free Trial
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Header;
