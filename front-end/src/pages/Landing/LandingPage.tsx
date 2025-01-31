import { Link } from "react-router-dom";
import Features from "@/components/Features/Features";

const LandingPage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="bg-black opacity-60 w-full h-full absolute"></div>
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Movie background"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-40">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block">
                Unlimited movies, TV shows, and more
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Watch anywhere. Cancel anytime. Start your free trial today.
            </p>
            <div className="mt-10 sm:flex sm:justify-center">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Features />
    </>
  );
};

export default LandingPage;
