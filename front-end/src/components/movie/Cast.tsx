// components/movie/Cast.tsx
import { motion } from "framer-motion";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface CastProps {
  cast: CastMember[];
}

export const Cast = ({ cast }: CastProps) => {
  const filteredCast = cast.filter((member) => member.profile_path).slice(0, 10);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Top Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCast.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group"
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="mt-2">
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {member.character}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
