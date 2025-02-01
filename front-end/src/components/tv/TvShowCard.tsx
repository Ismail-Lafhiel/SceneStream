// components/tv/TvShowCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPlay, FaStar, FaInfoCircle } from "react-icons/fa";
import { ITVShow } from "@/interfaces";
import { TrailerModal } from "@/components/common/TrailerModal";

interface TvShowCardProps {
  show: ITVShow;
  genres: Record<number, string>;
}

export const TvShowCard = ({ show, genres }: TvShowCardProps) => {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "/path-to-fallback-image.jpg";

  const showGenre = show.genre_ids[0] ? genres[show.genre_ids[0]] : "Unknown";

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="relative group"
        layout
      >
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
          <Link to={`/tv/${show.id}/details`}>
            <img
              src={imageUrl}
              alt={show.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-white text-sm font-medium">
                {show.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="space-y-3">
              <Link to={`/tv/${show.id}/details`}>
                <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 hover:text-blue-400 transition-colors">
                  {show.name}
                </h3>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span>{show.first_air_date.split("-")[0]}</span>
                <span>•</span>
                <span>{showGenre}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  <FaPlay size={12} />
                  Play Trailer
                </button>
                <Link
                  to={`/tv/${show.id}/details`}
                  className="p-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg transition-all duration-300 hover:shadow-lg"
                >
                  <FaInfoCircle size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <TrailerModal
        movieId={show.id}
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        type="tv"
      />
    </>
  );
};
