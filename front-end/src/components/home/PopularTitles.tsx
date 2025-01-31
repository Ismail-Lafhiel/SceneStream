import { useDarkMode } from "@/contexts/DarkModeContext";
import { FaPlay, FaStar, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: number;
  genre: string;
}

const mockMovies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: 4.8,
    year: 2020,
    genre: "Sci-Fi",
  },
  {
    id: 2,
    title: "The Dark Knight",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    rating: 4.9,
    year: 2008,
    genre: "Action",
  },
  // Add more mock movies...
];

const MovieCard = ({ movie }: { movie: Movie }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-2">
            <FaStar className="text-yellow-400" />
            <span className="text-white text-sm">{movie.rating}</span>
          </div>
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>{movie.year}</span>
            <span>{movie.genre}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2 text-sm transition-colors">
              <FaPlay size={12} />
              Play
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700 text-white rounded-md transition-colors">
              <FaInfoCircle size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const PopularTitles = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      className={`py-16 transition-colors ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Popular Right Now
          </h2>
          <button
            className={`text-sm font-medium transition-colors ${
              isDarkMode
                ? "text-blue-400 hover:text-blue-300"
                : "text-blue-600 hover:text-blue-500"
            }`}
          >
            View All
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {mockMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Category Tabs */}
        <div className="flex gap-4 mt-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            "Trending",
            "New Releases",
            "Action",
            "Drama",
            "Comedy",
            "Sci-Fi",
          ].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
