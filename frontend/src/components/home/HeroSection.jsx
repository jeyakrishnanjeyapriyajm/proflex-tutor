import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-40 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-600"
      >
        <Sparkles size={16} />
        <span>AI-Powered Learning for ICT Undergraduates</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-5xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-7xl"
      >
        Master Programming with <br />
        <span className="text-sky-600">ProgFlex Tutor</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-600"
      >
        The intelligent learning environment that adapts to your pace. Bridge
        your knowledge gaps with real-time AI feedback and personalized learning
        paths.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        <button
          onClick={() => navigate("/register")}
          className="group flex items-center gap-2 rounded-2xl bg-sky-600 px-10 py-5 font-bold text-white shadow-xl shadow-sky-200 transition-all hover:bg-sky-700"
        >
          Start Learning Now
          <ArrowRight
            size={20}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <button
          onClick={() => navigate("/login")}
          className="rounded-2xl bg-slate-100 px-10 py-5 font-bold text-slate-900 transition-all hover:bg-slate-200"
        >
          Instructor Portal
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative mx-auto mt-24 max-w-5xl"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-4 shadow-2xl">
          <div className="group relative flex aspect-video flex-col items-center justify-center overflow-hidden rounded-[1.5rem] bg-slate-50">
            <img
              src="https://picsum.photos/seed/dashboard/1200/800"
              alt="Dashboard Preview"
              className="h-full w-full rounded-[1.2rem] object-cover opacity-80"
              referrerPolicy="no-referrer"
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 p-12 text-center text-white">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 shadow-xl">
                <BrainCircuit size={32} />
              </div>

              <h3 className="mb-2 text-3xl font-bold">AI Knowledge Tracing</h3>

              <p className="text-lg font-medium text-sky-100">
                Mastery: 84% — Pointers & Memory
              </p>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-400/20 blur-3xl" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
