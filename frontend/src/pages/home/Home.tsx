import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { PopularTitles } from "@/components/home/PopularTitles";
import { DeviceSection } from "@/components/home/DeviceSection";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`transition-colors ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <HeroSection />
      <FeaturesGrid />
      <DeviceSection />

      {}
      <PopularTitles />
    </div>
  );
};

export default Home;
