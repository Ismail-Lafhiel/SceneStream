import { BiMoviePlay } from "react-icons/bi";
import { FaTv, FaTablet, FaGlobe, FaDownload, FaUsers } from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { motion } from "framer-motion";

export const FeaturesGrid = () => {
  const { isDarkMode } = useDarkMode();

  const features = [
    {
      icon: <BiMoviePlay className="h-8 w-8" />,
      title: "Exclusive Content",
      description:
        "Stream exclusive movies and shows you won't find anywhere else.",
    },
    {
      icon: <FaTv className="h-8 w-8" />,
      title: "HD Quality",
      description:
        "Enjoy crystal clear HD and 4K streaming on supported devices.",
    },
    {
      icon: <FaTablet className="h-8 w-8" />,
      title: "Watch Everywhere",
      description:
        "Stream on your phone, tablet, laptop, and TV without paying more.",
    },
    {
      icon: <FaGlobe className="h-8 w-8" />,
      title: "Global Access",
      description: "Access your entertainment from anywhere in the world.",
    },
    {
      icon: <FaDownload className="h-8 w-8" />,
      title: "Download & Watch",
      description: "Download your favorites and watch offline on the go.",
    },
    {
      icon: <FaUsers className="h-8 w-8" />,
      title: "Multiple Profiles",
      description: "Create up to 6 profiles for your family members.",
    },
  ];

  return (
    <section
      className={`py-24 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } transition-colors`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose <span className="text-blue-600">SceneStream</span>?
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Everything you need for the perfect streaming experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl ${
                isDarkMode
                  ? "bg-gray-800 hover:bg-gray-800/80"
                  : "bg-gray-50 hover:bg-gray-100"
              } transition-all duration-300`}
            >
              <div className="mb-4">
                <div className={`text-blue-600`}>{feature.icon}</div>
              </div>
              <h3
                className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                } leading-relaxed`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
