import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { movieService, tvService } from "@/services/api";
import { IVideo } from "@/interfaces";

interface TrailerModalProps {
  movieId: number;
  isOpen: boolean;
  onClose: () => void;
  type?: 'movie' | 'tv';
}

export const TrailerModal = ({
  movieId,
  isOpen,
  onClose,
  type = 'movie'
}: TrailerModalProps) => {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setTrailerKey(null);

        const videos = type === 'movie' 
          ? await movieService.getMovieVideos(movieId)
          : await tvService.getTvShowVideos(movieId);

        // Try to find the best video in this order: Trailer -> Teaser -> Other
        const trailer = videos.results.find(
          (video: IVideo) => 
            video.site === "YouTube" && 
            video.type === "Trailer"
        ) || videos.results.find(
          (video: IVideo) => 
            video.site === "YouTube" && 
            video.type === "Teaser"
        ) || videos.results.find(
          (video: IVideo) => 
            video.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setError("No trailer available");
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setError("Failed to load trailer");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchTrailer();
    }
  }, [movieId, isOpen, type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-white space-y-4">
                <div className="text-red-500 text-xl">{error}</div>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full text-white space-x-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading trailer...</span>
              </div>
            ) : trailerKey ? (
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            ) : null}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hover:scale-110 transform duration-200"
            >
              <FaTimes size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
