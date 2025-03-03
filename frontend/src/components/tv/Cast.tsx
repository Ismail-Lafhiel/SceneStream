import { ICast } from "@/interfaces";
import { motion } from "framer-motion";

interface CastProps {
  cast: ICast[];
}

export const Cast = ({ cast }: CastProps) => {
  const mainCast = cast.slice(0, 10);

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Main Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {mainCast.map((person) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-medium">{person.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {person.character}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
