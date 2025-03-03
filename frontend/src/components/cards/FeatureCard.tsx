import { useDarkMode } from "@/contexts/DarkModeContext";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const { isDarkMode } = useDarkMode();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`group p-8 rounded-2xl transition-all duration-300 ${
        isDarkMode
          ? "bg-gray-800/50 hover:bg-gray-800 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10"
          : "bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icon wrapper with animated background */}
        <div className="relative">
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
              isDarkMode ? "bg-blue-500" : "bg-blue-200"
            }`}
          />
          <div
            className={`relative p-4 rounded-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700/50 group-hover:bg-gray-700"
                : "bg-blue-50 group-hover:bg-blue-100"
            }`}
          >
            {icon}
          </div>
        </div>

        {/* Title with hover effect */}
        <h3
          className={`text-xl font-semibold transition-colors duration-300 ${
            isDarkMode
              ? "text-white group-hover:text-blue-400"
              : "text-gray-900 group-hover:text-blue-600"
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`transition-colors duration-300 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {description}
        </p>

        {/* Optional: Add a subtle line decoration */}
        <div
          className={`w-12 h-1 rounded-full transition-all duration-300 transform origin-left ${
            isDarkMode
              ? "bg-blue-500/20 group-hover:bg-blue-500/40"
              : "bg-blue-100 group-hover:bg-blue-200"
          } group-hover:scale-150`}
        />
      </div>
    </motion.div>
  );
};
export default FeatureCard;
