import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-0">
        <div className="bg-gradient-to-r from-blue-900/90 to-black/70 absolute inset-0 z-10"></div>
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Movie background"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight font-['Poppins'] animate-fade-in">
            Unlimited Entertainment
            <span className="block text-blue-400">Anytime, Anywhere</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300 animate-fade-in-delay">
            Stream thousands of movies and TV shows instantly on any device.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-delay-2">
            <Link
              to="/register"
              className="group px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
            >
              <FaPlay className="group-hover:animate-pulse" />
              Start Watching
            </Link>
            <Link
              to="/plans"
              className="px-8 py-4 bg-gray-800/80 text-white rounded-lg text-lg font-semibold hover:bg-gray-700/80 transition-all hover:scale-105 shadow-lg"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
