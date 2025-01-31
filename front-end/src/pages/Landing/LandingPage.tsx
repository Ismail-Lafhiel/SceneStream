import { Link } from "react-router-dom";
import { FaPlay, FaTv, FaTablet, FaStar } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import Features from "@/components/Features/Features";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
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
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight font-['Poppins']">
              Unlimited Entertainment
              <span className="block text-blue-400">Anytime, Anywhere</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Stream thousands of movies and TV shows instantly on any device.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlay />
                Start Watching
              </Link>
              <Link
                to="/plans"
                className="px-8 py-4 bg-gray-800/80 text-white rounded-lg text-lg font-semibold hover:bg-gray-700/80 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<BiMoviePlay className="h-8 w-8 text-blue-500" />}
              title="Exclusive Content"
              description="Stream exclusive movies and shows you won't find anywhere else."
            />
            <FeatureCard
              icon={<FaTv className="h-8 w-8 text-blue-500" />}
              title="HD Quality"
              description="Enjoy crystal clear HD and 4K streaming on supported devices."
            />
            <FeatureCard
              icon={<FaTablet className="h-8 w-8 text-blue-500" />}
              title="Watch Everywhere"
              description="Stream on your phone, tablet, laptop, and TV without paying more."
            />
          </div>
        </div>
      </section>

      {/* Popular Titles Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8">
            Popular Right Now
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Add movie cards here */}
          </div>
        </div>
      </section>

      <Features />
    </>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700/50 transition-colors">
      <div className="flex flex-col items-center text-center">
        {icon}
        <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default LandingPage;
