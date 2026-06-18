import { Link } from "react-router-dom";
import { BrainCircuit, Sparkles } from "lucide-react";

const LandingFooter = () => {
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
    <footer className="bg-slate-900 py-20 text-slate-400">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Link
              to="/"
              className="mb-6 flex items-center gap-3 text-white transition-opacity hover:opacity-80"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600">
                <BrainCircuit size={20} />
              </div>

              <span className="text-lg font-bold tracking-tight">ProgFlex</span>
            </Link>

            <p className="mb-6 text-sm leading-relaxed">
              Empowering the next generation of ICT professionals with AI-driven
              adaptive learning.
            </p>

            <div className="flex gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-800 transition-all hover:bg-sky-600 hover:text-white"
                >
                  <Sparkles size={14} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Product</h4>

            <ul className="space-y-4 text-sm">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left transition-colors hover:text-white"
                >
                  Features
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left transition-colors hover:text-white"
                >
                  How It Works
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("curriculum")}
                  className="text-left transition-colors hover:text-white"
                >
                  Curriculum
                </button>
              </li>

              <li>
                <button
                  onClick={() => scrollToSection("about-us")}
                  className="text-left transition-colors hover:text-white"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Resources</h4>

            <ul className="space-y-4 text-sm">
              <li>
                <button className="text-left transition-colors hover:text-white">
                  Documentation
                </button>
              </li>

              <li>
                <button className="text-left transition-colors hover:text-white">
                  Help Center
                </button>
              </li>

              <li>
                <button className="text-left transition-colors hover:text-white">
                  Community
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-bold text-white">Legal</h4>

            <ul className="space-y-4 text-sm">
              <li>
                <button className="text-left transition-colors hover:text-white">
                  Privacy Policy
                </button>
              </li>

              <li>
                <button className="text-left transition-colors hover:text-white">
                  Terms of Service
                </button>
              </li>

              <li>
                <button className="text-left transition-colors hover:text-white">
                  Cookie Policy
                </button>
              </li>

              <li>
                <button className="text-left transition-colors hover:text-white">
                  Security
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 text-xs md:flex-row">
          <p>© 2026 ProgFlex Tutor. All rights reserved.</p>

          <div className="flex flex-wrap gap-8">
            <span>University of Colombo — Faculty of Technology</span>
            <span>Department of ICT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
