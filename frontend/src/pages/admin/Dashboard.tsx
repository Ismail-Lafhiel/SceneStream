import { useState, useEffect } from "react";
import {
  FaUsers,
  FaFilm,
  FaStar,
  FaChartLine,
  FaEye,
  FaRegClock,
  FaFire,
  FaCalendar,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Dashboard = () => {
  const { isDarkMode } = useDarkMode();
  const [timeRange, setTimeRange] = useState("week");
  const [topMovies, setTopMovies] = useState([
    {
      id: 1,
      title: "Inception",
      poster: "https://via.placeholder.com/150x225",
      rating: 4.8,
      reviews: 2435,
      genre: "Sci-Fi",
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      poster: "https://via.placeholder.com/150x225",
      rating: 4.9,
      reviews: 5621,
      genre: "Drama",
    },
    {
      id: 3,
      title: "The Dark Knight",
      poster: "https://via.placeholder.com/150x225",
      rating: 4.7,
      reviews: 4982,
      genre: "Action",
    },
    {
      id: 4,
      title: "Pulp Fiction",
      poster: "https://via.placeholder.com/150x225",
      rating: 4.6,
      reviews: 3854,
      genre: "Crime",
    },
  ]);

  // Static statistics
  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: "12,845",
      increase: "+12.5%",
      icon: FaUsers,
      color: "bg-blue-600",
      darkHoverColor: "dark:hover:bg-blue-600/40",
      lightHoverColor: "hover:bg-blue-50",
    },
    {
      id: 2,
      title: "Total Movies",
      value: "4,721",
      increase: "+5.3%",
      icon: FaFilm,
      color: "bg-indigo-600",
      darkHoverColor: "dark:hover:bg-indigo-600/40",
      lightHoverColor: "hover:bg-indigo-50",
    },
    {
      id: 3,
      title: "Reviews",
      value: "37,892",
      increase: "+18.7%",
      icon: FaStar,
      color: "bg-yellow-600",
      darkHoverColor: "dark:hover:bg-yellow-600/40",
      lightHoverColor: "hover:bg-yellow-50",
    },
    {
      id: 4,
      title: "Movie Views",
      value: "2.3M",
      increase: "+15.2%",
      icon: FaEye,
      color: "bg-green-600",
      darkHoverColor: "dark:hover:bg-green-600/40",
      lightHoverColor: "hover:bg-green-50",
    },
  ];

  // Static activity data
  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "Rated 'Dune' with 5 stars",
      time: "5 minutes ago",
    },
    {
      id: 2,
      user: "Sarah Smith",
      action: "Added a review for 'Oppenheimer'",
      time: "10 minutes ago",
    },
    {
      id: 3,
      user: "Michael Brown",
      action: "Added 'The Godfather' to favorites",
      time: "25 minutes ago",
    },
    {
      id: 4,
      user: "Emily Johnson",
      action: "Rated 'Barbie' with 4 stars",
      time: "1 hour ago",
    },
    {
      id: 5,
      user: "James Wilson",
      action: "Added a review for 'Mission Impossible'",
      time: "2 hours ago",
    },
  ];

  // Upcoming movies
  const upcomingMovies = [
    {
      id: 1,
      title: "Avatar 3",
      releaseDate: "Dec 19, 2025",
      anticipation: "High",
    },
    {
      id: 2,
      title: "Mission: Impossible 8",
      releaseDate: "May 23, 2025",
      anticipation: "Medium",
    },
    {
      id: 3,
      title: "Black Panther 3",
      releaseDate: "Nov 5, 2025",
      anticipation: "High",
    },
    {
      id: 4,
      title: "Fantastic Four",
      releaseDate: "July 25, 2025",
      anticipation: "Medium",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Page Title and Dark Mode Toggle */}
        <div className="flex justify-between items-center">
          <h1
            className={`text-3xl font-extrabold tracking-tight ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Movie Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div
              className={`p-1 rounded-lg ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex space-x-1">
                {["day", "week", "month", "year"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      timeRange === range
                        ? `bg-blue-600 text-white`
                        : `${
                            isDarkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`relative overflow-hidden p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 group ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700 dark:hover:shadow-xl " + stat.darkHoverColor
                  : "bg-white border border-gray-100 hover:shadow-xl " + stat.lightHoverColor
              }`}
            >
              <div
                className={`absolute right-0 top-0 -mt-4 -mr-12 w-32 h-32 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${stat.color}`}
              ></div>
              <div className="relative flex justify-between">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {stat.title}
                  </p>
                  <p
                    className={`text-2xl font-bold mt-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} h-12 w-12 rounded-lg flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:scale-110 duration-300`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-medium text-green-500">
                  {stat.increase}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  since last {timeRange}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Top Movies and Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Movies */}
          <div
            className={`lg:col-span-2 p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg font-bold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FaFire className="text-red-500 mr-2" /> Top Rated Movies
              </h2>
              <button className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topMovies.map((movie) => (
                <div
                  key={movie.id}
                  className={`rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                    isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-white"
                  }`}
                >
                  <div className="h-40 bg-gray-300 overflow-hidden relative group">
                    <img
                      src={movie.poster || "/api/placeholder/150/225"}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-3 w-full">
                        <button className="w-full py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3
                      className={`font-medium text-sm ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } truncate`}
                    >
                      {movie.title}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <FaStar className="text-yellow-500 mr-1" />
                        <span
                          className={`text-sm font-bold ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {movie.rating}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode 
                            ? "bg-gray-600 text-gray-300" 
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {movie.genre}
                      </span>
                    </div>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      } mt-1`}
                    >
                      {movie.reviews.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2
                className={`text-lg font-bold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FaRegClock className="text-blue-500 mr-2" /> Recent
                Activity
              </h2>
              <button className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-3 pb-4 ${
                    activity.id !== recentActivity.length
                      ? `border-b ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`
                      : ""
                  } hover:bg-opacity-50 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  } -mx-6 px-6 py-2 transition-colors rounded-md`}
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm shadow-md">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {activity.user}
                    </p>
                    <p
                      className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {activity.action}
                    </p>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Movies Section */}
        <div
          className={`p-6 rounded-xl shadow-lg ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-100"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-lg font-bold flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaCalendar className="text-green-500 mr-2" /> Upcoming
              Releases
            </h2>
            <button className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
              View Calendar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table
              className={`min-w-full divide-y ${
                isDarkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead className={isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Movie Title
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Release Date
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Anticipation
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-500"
                    } uppercase tracking-wider`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {upcomingMovies.map((movie, index) => (
                  <tr 
                    key={movie.id} 
                    className={`${
                      isDarkMode 
                        ? "hover:bg-gray-700" 
                        : "hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {movie.title}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {movie.releaseDate}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          movie.anticipation === "High"
                            ? isDarkMode 
                              ? "bg-green-900/50 text-green-400" 
                              : "bg-green-100 text-green-800"
                            : movie.anticipation === "Medium"
                            ? isDarkMode 
                              ? "bg-yellow-900/50 text-yellow-400" 
                              : "bg-yellow-100 text-yellow-800"
                            : isDarkMode 
                              ? "bg-gray-700 text-gray-300" 
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {movie.anticipation}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                        Set Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genre Distribution */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg font-bold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FaChartLine className="text-purple-500 mr-2" /> Genre
                Distribution
              </h2>
              <select
                className={`text-sm rounded-md border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                } p-2 transition-colors`}
              >
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for chart */}
              <div className="text-center">
                <p
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Chart would be rendered here
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <span className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span className={isDarkMode ? "text-white" : "text-gray-700"}>Action (28%)</span>
                  </span>
                  <span className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                    <span className={isDarkMode ? "text-white" : "text-gray-700"}>Drama (24%)</span>
                  </span>
                  <span className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span className={isDarkMode ? "text-white" : "text-gray-700"}>Comedy (18%)</span>
                  </span>
                  <span className={`flex items-center px-3 py-2 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span className={isDarkMode ? "text-white" : "text-gray-700"}>Other (30%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Activity Trends */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-lg font-bold flex items-center ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                <FaUsers className="text-teal-500 mr-2" /> User Activity
              </h2>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Reviews
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-md transition-colors bg-blue-600 text-white hover:bg-blue-700`}
                >
                  Ratings
                </button>
                <button
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    isDarkMode
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Watchlist
                </button>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              {/* Placeholder for chart */}
              <div className="text-center">
                <p
                  className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Activity trend would be rendered here
                </p>
                <div className="mt-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-lg ${
                      isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
                    }`}
                  >
                    ↑ 22% increase in user ratings this {timeRange}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;