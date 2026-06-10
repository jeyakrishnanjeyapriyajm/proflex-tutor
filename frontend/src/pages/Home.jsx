import MainLayout from "../layouts/MainLayout";

import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import StatsSection from "../components/home/StatsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CurriculumPreviewSection from "../components/home/CurriculumPreviewSection";
import AboutPreviewSection from "../components/home/AboutPreviewSection";
import FinalCTASection from "../components/home/FinalCTASection";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <StatsSection />
      <HowItWorksSection />
      <CurriculumPreviewSection />
      <AboutPreviewSection />
      <FinalCTASection />
    </MainLayout>
  );
};

export default Home;
