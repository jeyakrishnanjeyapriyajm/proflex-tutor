import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";

const LandingHeader = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-lg shadow-sky-200">
            <BrainCircuit size={24} />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            ProgFlex
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => scrollToSection("features")}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how-it-works")}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            How it works
          </button>

          <button
            onClick={() => scrollToSection("curriculum")}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            Curriculum
          </button>

          <button
            onClick={() => scrollToSection("about-us")}
            className="text-sm font-medium text-slate-600 transition-colors hover:text-sky-600"
          >
            About Us
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Sign In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-700"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
