import { useDarkMode } from "@/contexts/DarkModeContext";
import { motion } from "framer-motion";
import {
  FaLaptop,
  FaMobileAlt,
  FaTabletAlt,
  FaTv,
  FaCheck,
} from "react-icons/fa";

export const DeviceSection = () => {
  const { isDarkMode } = useDarkMode();

  const devices = [
    {
      icon: <FaTv className="w-6 h-6" />,
      title: "Smart TV",
      description: "Samsung, LG, Android TV, Apple TV",
    },
    {
      icon: <FaLaptop className="w-6 h-6" />,
      title: "Computer",
      description: "Chrome OS, MacOS, Windows",
    },
    {
      icon: <FaMobileAlt className="w-6 h-6" />,
      title: "Mobile",
      description: "iPhone & Android phones",
    },
    {
      icon: <FaTabletAlt className="w-6 h-6" />,
      title: "Tablet",
      description: "iPad & Android tablets",
    },
  ];

  const features = [
    "Watch on 4 different devices at the same time",
    "Create up to 6 personalized profiles",
    "Download your shows to watch offline",
    "Cancel or switch plans anytime",
  ];

  return (
    <section
      className={`py-24 transition-colors ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2
                className={`text-4xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Watch on Any Device
              </h2>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Stream on your phone, tablet, laptop, and TV without paying
                more. Available on all of your favorite devices.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {devices.map((device, index) => (
                <motion.div
                  key={device.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  } transition-all duration-300 hover:shadow-lg`}
                >
                  <div className="text-blue-600 mb-3">{device.icon}</div>
                  <h3
                    className={`font-semibold mb-1 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {device.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {device.description}
                  </p>
                </motion.div>
              ))}
            </div>

            <ul className="space-y-3">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <FaCheck className="text-blue-600 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://your-cdn.com/devices-mockup.png"
                alt="Devices mockup"
                className="w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 ${
                  isDarkMode ? "bg-blue-900/10" : "bg-blue-100/20"
                }`}
              ></div>
            </div>

            {/* Floating devices decoration */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
