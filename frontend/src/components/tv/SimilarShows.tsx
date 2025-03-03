import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { tvService } from "@/services/api";
import { ITVShow } from "@/interfaces";

interface SimilarShowsProps {
  showId: number;
}

export const SimilarShows = ({ showId }: SimilarShowsProps) => {
  const [shows, setShows] = useState<ITVShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarShows = async () => {
      try {
        setIsLoading(true);
        const data = await tvService.getSimilarTvShows(showId);
        setShows(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching similar shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarShows();
  }, [showId]);

  if (isLoading || shows.length === 0) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Similar Shows</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shows.map((show) => (
          <Link key={show.id} to={`/tv/${show.id}/details`} className="group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                  alt={show.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-medium group-hover:text-blue-500 transition-colors">
                  {show.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(show.first_air_date).getFullYear()}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};
