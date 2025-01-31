// src/components/Footer.tsx
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPlay,
} from "react-icons/fa";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Footer = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <footer
      className={`border-t transition-colors duration-200 ${
        isDarkMode
          ? "bg-gray-900 border-gray-800"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-8">
          <FaPlay className="text-blue-500 h-8 w-8" />
          <h1
            className={`text-3xl font-bold ml-2 font-['Poppins'] ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            SceneStream
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                    className={`hover:text-blue-500 transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
                    className={`hover:text-blue-500 transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

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
                      className={`hover:text-blue-500 transition-colors ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

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
                    className={`hover:text-blue-500 transition-colors ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Icon size={20} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p
            className={`text-center text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            © {new Date().getFullYear()} SceneStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
