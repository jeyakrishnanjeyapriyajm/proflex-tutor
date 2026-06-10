import Navbar from "../components/navigation/Navbar";
import Footer from "../components/navigation/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
