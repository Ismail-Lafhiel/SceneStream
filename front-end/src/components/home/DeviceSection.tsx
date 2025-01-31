import { useDarkMode } from "@/contexts/DarkModeContext";

export const DeviceSection = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <section
      className={`py-24 transition-colors ${
        isDarkMode ? "bg-gray-800" : "bg-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
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
              Stream on your phone, tablet, laptop, and TV without paying more.
              Available on all of your favorite devices.
            </p>
            <ul className="space-y-4">{/* Add device list */}</ul>
          </div>
          <div className="relative">{/* Add device mockup image */}</div>
        </div>
      </div>
    </section>
  );
};
