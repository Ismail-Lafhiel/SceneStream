//@ts-nocheck
import {
  Film,
  Users,
  Crown,
  Download,
  Star,
  Smartphone,
  Monitor,
} from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";

const Pricing = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <section className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/95 via-black/90 to-black/95"></div>
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Streaming Background"
        />
      </div>
      <div className="w-full z-10">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
              Choose Your Perfect Streaming Experience
            </h2>
            <p className="mb-5 font-light text-gray-300 sm:text-xl">
              Unlimited access to movies, TV shows, and documentaries. Watch
              anywhere, cancel anytime.
            </p>
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {/* Basic Plan */}
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow xl:p-8 bg-gray-800/40 backdrop-blur-sm border-blue-500/20 text-white transform transition duration-500 hover:scale-105">
              <h3 className="mb-4 text-2xl font-semibold">Basic</h3>
              <p className="font-light text-gray-300 sm:text-lg mb-8">
                Perfect for solo entertainment seekers
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$8.99</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <Film className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>HD Streaming Quality</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Smartphone className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Watch on 1 device at a time</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Download className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Download on 1 device</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Ad-free entertainment</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-auto"
              >
                Start Free Trial
              </a>
            </div>

            {/* Standard Plan */}
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow xl:p-8 bg-blue-900/40 backdrop-blur-sm border-blue-500/40 text-white transform transition duration-500 hover:scale-105">
              <div className="absolute top-0 right-6 -translate-y-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-semibold">Standard</h3>
              <p className="font-light text-gray-300 sm:text-lg mb-8">
                Ideal for couples and small families
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$14.99</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <Film className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>4K Ultra HD Available</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Watch on 2 devices at a time</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Download className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Download on 2 devices</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Monitor className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Smart TV app access</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-auto"
              >
                Start Free Trial
              </a>
            </div>

            {/* Premium Plan */}
            <div className="flex flex-col p-6 mx-auto max-w-lg text-center rounded-lg border shadow xl:p-8 bg-gray-800/40 backdrop-blur-sm border-blue-500/20 text-white transform transition duration-500 hover:scale-105">
              <h3 className="mb-4 text-2xl font-semibold">Premium</h3>
              <p className="font-light text-gray-300 sm:text-lg mb-8">
                Ultimate entertainment for the whole family
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$19.99</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <Crown className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>All Standard features plus:</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Users className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Watch on 4 devices at a time</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Download className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Download on 4 devices</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Star className="flex-shrink-0 w-5 h-5 text-blue-400" />
                  <span>Early access to new releases</span>
                </li>
              </ul>
              <a
                href="#"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-auto"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
