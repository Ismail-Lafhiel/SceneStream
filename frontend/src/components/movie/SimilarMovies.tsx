// components/movie/SimilarMovies.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { movieService } from "@/services/api";
import { IMovie } from "@/interfaces";

interface SimilarMoviesProps {
  movieId: number;
}

export const SimilarMovies = ({ movieId }: SimilarMoviesProps) => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
      try {
        setIsLoading(true);
        const data = await movieService.getSimilarMovies(movieId);
        setMovies(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching similar movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarMovies();
  }, [movieId]);

  if (isLoading || movies.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Similar Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}/details`}
            className="group"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium group-hover:text-blue-500 transition-colors">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(movie.release_date).getFullYear()}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};
