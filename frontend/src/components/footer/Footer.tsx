import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <footer className="relative">
      {/* Backdrop blur container */}
      <div
        className={`relative border-t backdrop-blur-sm transition-colors duration-200 ${
          isDarkMode
            ? "bg-gray-900/80 border-blue-500/20"
            : "bg-white/80 border-blue-200"
        }`}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Logo Section with hover effect */}
          <div className="flex items-center justify-center mb-8 group transition-transform hover:scale-105">
            <h1
              className={`text-3xl font-bold ml-2 font-['Poppins'] ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Scene<span className="text-blue-600">Stream</span>
            </h1>
          </div>

          {/* Grid Section with enhanced hover effects */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company Section */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Company
              </h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`block px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-800/50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/50"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Support
              </h3>
              <ul className="space-y-2">
                {["Help Center", "Contact Us", "FAQ"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className={`block px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-800/50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/50"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Legal
              </h3>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className={`block px-3 py-1 rounded-lg transition-all duration-300 hover:scale-105 ${
                          isDarkMode
                            ? "text-gray-400 hover:text-white hover:bg-gray-800/50"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/50"
                        }`}
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map(
                  (Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                        isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-gray-800/50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-100/50"
                      }`}
                    >
                      <Icon size={20} />
                    </a>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="mt-8 pt-8 border-t border-blue-500/20">
            <p
              className={`text-center text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {new Date().getFullYear()} SceneStream. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
