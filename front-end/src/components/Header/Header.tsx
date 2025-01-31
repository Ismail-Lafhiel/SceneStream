// src/components/Header.tsx
import { Link } from "react-router-dom";
import {
  FaPlay,
  FaSearch,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useState } from "react";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed w-full z-50 transition-colors duration-200 ${
        isDarkMode
          ? "bg-gray-900/95 backdrop-blur-sm"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <FaPlay className="text-blue-500 h-8 w-8" />
              <h1
                className={`text-3xl font-bold ml-2 font-['Poppins'] ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                SceneStream
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies & shows"
                className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              />
            </div>

            <Link
              to="/login"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
            >
              Start Free Trial
            </Link>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-md transition-colors ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="relative mb-4">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies & shows"
                className={`w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              />
            </div>

            <Link
              to="/login"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="block w-full text-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
