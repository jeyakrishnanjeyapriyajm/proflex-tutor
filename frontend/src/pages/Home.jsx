import MainLayout from "../layouts/MainLayout";
import HeroSection from "../components/home/HeroSection";
import FeatureSection from "../components/home/FeatureSection";
import RoleSection from "../components/home/RoleSection";
import WorkflowSection from "../components/home/WorkflowSection";
import CTASection from "../components/home/CTASection";

const Home = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureSection />
      <RoleSection />
      <WorkflowSection />
      <CTASection />
    </MainLayout>
  );
};

export default Home;
