import { Link } from "react-router-dom";
import { FaPlay, FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <nav className="bg-blue-900/95 backdrop-blur-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <FaPlay className="text-blue-500 h-8 w-8" />
              <h1 className="text-white text-3xl font-bold ml-2 font-['Poppins']">
                SceneStream
              </h1>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies & shows"
                  className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
