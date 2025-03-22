//@ts-nocheck
import { useState, useEffect } from "react";
import { FaUsers, FaFilm, FaStar, FaEye, FaChartLine } from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import {
  getMovieStatistics,
  getTVShowStatistics,
  getGenreStatistics,
  getUserStatistics,
  getAllStatistics,
} from "@/services/StatisticsService";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { isDarkMode } = useDarkMode();

  // State for statistics
  const [movieStats, setMovieStats] = useState(null);
  const [tvShowStats, setTVShowStats] = useState(null);
  const [genreStats, setGenreStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [allStats, setAllStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const movieStats = await getMovieStatistics();
        const tvShowStats = await getTVShowStatistics();
        const genreStats = await getGenreStatistics();
        const userStats = await getUserStatistics();
        const allStats = await getAllStatistics();

        setMovieStats(movieStats);
        setTVShowStats(tvShowStats);
        setGenreStats(genreStats);
        setUserStats(userStats);
        setAllStats(allStats);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-medium text-red-500">Error: {error}</p>
      </div>
    );
  }

  // Stats cards data
  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: userStats?.totalUsers || "Loading...",
      icon: FaUsers,
      color: "bg-blue-600",
      darkHoverColor: "dark:hover:bg-blue-600/40",
      lightHoverColor: "hover:bg-blue-50",
    },
    {
      id: 2,
      title: "Total Movies",
      value: movieStats?.totalMovies || "Loading...",
      icon: FaFilm,
      color: "bg-indigo-600",
      darkHoverColor: "dark:hover:bg-indigo-600/40",
      lightHoverColor: "hover:bg-indigo-50",
    },
    {
      id: 3,
      title: "Total TV Shows",
      value: tvShowStats?.totalTVShows || "Loading...",
      icon: FaStar,
      color: "bg-yellow-600",
      darkHoverColor: "dark:hover:bg-yellow-600/40",
      lightHoverColor: "hover:bg-yellow-50",
    },
    {
      id: 4,
      title: "Total Genres",
      value: genreStats?.totalGenres || "Loading...",
      icon: FaEye,
      color: "bg-green-600",
      darkHoverColor: "dark:hover:bg-green-600/40",
      lightHoverColor: "hover:bg-green-50",
    },
  ];

  // Data for Genre Distribution Pie Chart
  const genreData = [
    { name: "Action", value: 40 },
    { name: "Drama", value: 30 },
    { name: "Comedy", value: 20 },
    { name: "Sci-Fi", value: 10 },
  ];

  // Data for Vote Average Bar Chart
  const voteData = [
    { name: "Movies", value: movieStats?.averageVote || 0 },
    { name: "TV Shows", value: tvShowStats?.averageVote || 0 },
  ];

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="space-y-6 p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1
          className={`text-3xl font-extrabold tracking-tight ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className={`relative overflow-hidden p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 group ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700 dark:hover:shadow-xl " +
                    stat.darkHoverColor
                  : "bg-white border border-gray-100 hover:shadow-xl " +
                    stat.lightHoverColor
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
                  +12.5%
                </span>
                <span
                  className={`text-sm ml-1 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  since last week
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Genre Distribution Pie Chart */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold flex items-center mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaChartLine className="text-purple-500 mr-2" /> Genre
              Distribution
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={genreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {genreData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vote Average Bar Chart */}
          <div
            className={`p-6 rounded-xl shadow-lg ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-100"
            }`}
          >
            <h2
              className={`text-lg font-bold flex items-center mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <FaChartLine className="text-blue-500 mr-2" /> Average Vote
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={voteData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;