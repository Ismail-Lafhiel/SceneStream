import { BiMoviePlay } from "react-icons/bi";
import { FaTv, FaTablet, FaGlobe, FaDownload, FaUsers } from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";
import FeatureCard from "../cards/FeatureCard";

export const FeaturesGrid = () => {
  const { isDarkMode } = useDarkMode();

  const features = [
    {
      icon: <BiMoviePlay className="h-8 w-8 text-blue-500" />,
      title: "Exclusive Content",
      description:
        "Stream exclusive movies and shows you won't find anywhere else.",
    },
    {
      icon: <FaTv className="h-8 w-8 text-blue-500" />,
      title: "HD Quality",
      description:
        "Enjoy crystal clear HD and 4K streaming on supported devices.",
    },
    {
      icon: <FaTablet className="h-8 w-8 text-blue-500" />,
      title: "Watch Everywhere",
      description:
        "Stream on your phone, tablet, laptop, and TV without paying more.",
    },
    {
      icon: <FaGlobe className="h-8 w-8 text-blue-500" />,
      title: "Global Access",
      description: "Access your entertainment from anywhere in the world.",
    },
    {
      icon: <FaDownload className="h-8 w-8 text-blue-500" />,
      title: "Download & Watch",
      description: "Download your favorites and watch offline on the go.",
    },
    {
      icon: <FaUsers className="h-8 w-8 text-blue-500" />,
      title: "Multiple Profiles",
      description: "Create up to 6 profiles for your family members.",
    },
  ];

  return (
    <section
      className={`py-24 transition-colors ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Why Choose SceneStream?
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Everything you need for the perfect streaming experience
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
