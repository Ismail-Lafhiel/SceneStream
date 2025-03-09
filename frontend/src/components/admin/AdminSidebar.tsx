import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaFilm,
  FaStar,
  FaAngleRight,
  FaAngleDown,
  FaCalendarAlt,
  FaFireAlt,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";

const AdminSidebar = () => {
  const location = useLocation();
  const { isDarkMode } = useDarkMode();
  const [expandedMenus, setExpandedMenus] = useState([]);

  const toggleMenu = (menuId) => {
    if (expandedMenus.includes(menuId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== menuId));
    } else {
      setExpandedMenus([...expandedMenus, menuId]);
    }
  };

  const navigationItems = [
    {
      id: "dashboard",
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      id: "users",
      label: "User Management",
      icon: <FaUsers />,
      subItems: [
        { path: "/admin/users", label: "All Users" },
        { path: "/admin/users/reviews", label: "User Reviews" },
      ],
    },
    {
      id: "movies",
      label: "Movie Management",
      icon: <FaFilm />,
      subItems: [
        { path: "/admin/movies", label: "All Movies" },
        { path: "/admin/movies/popular", label: "Popular Movies" },
        { path: "/admin/movies/top-rated", label: "Top Rated" },
        { path: "/admin/movies/upcoming", label: "Upcoming Releases" },
      ],
    },
    {
      id: "categories",
      path: "/admin/categories",
      label: "Categories",
      icon: <FaFireAlt />,
    },
    {
      id: "reviews",
      path: "/admin/reviews",
      label: "Reviews",
      icon: <FaStar />,
    },
    {
      id: "release-dates",
      path: "/admin/release-dates",
      label: "Release Dates",
      icon: <FaCalendarAlt />,
    },
  ];

  return (
    <aside
      className={`w-64 h-screen overflow-y-auto flex-shrink-0 transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800 text-gray-300 border-r border-gray-700"
          : "bg-gray-800 text-white border-r border-gray-700"
      }`}
    >
      {/* Logo Section */}
      <div
        className={`h-16 flex items-center px-6 ${
          isDarkMode ? "border-b border-gray-700" : "border-b border-gray-700"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            SceneStream
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 px-3">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </p>
        </div>

        {navigationItems.map((item) => (
          <div key={item.id} className="mb-1">
            {item.subItems ? (
              <>
                <button
                  onClick={() => toggleMenu(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith(`/admin/${item.id}`)
                      ? "bg-blue-600 text-white"
                      : isDarkMode
                      ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {expandedMenus.includes(item.id) ? (
                    <FaAngleDown className="text-sm" />
                  ) : (
                    <FaAngleRight className="text-sm" />
                  )}
                </button>
                {expandedMenus.includes(item.id) && (
                  <div className="mt-1 ml-5 pl-3 border-l border-gray-700 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          location.pathname === subItem.path
                            ? "bg-blue-600 text-white"
                            : isDarkMode
                            ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : isDarkMode
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}

        {/* Bottom Section */}
        <div className="mt-8 mb-4 px-3">
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800" : "bg-gray-700"
            }`}
          >
            <p className="text-sm text-gray-300 mb-2">
              Want to add a new movie?
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
              <FaFilm className="mr-2" /> Add New Movie
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
