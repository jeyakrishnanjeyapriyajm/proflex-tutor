import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-24 text-center">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[3rem] bg-slate-900 p-12 text-white md:p-20">
        <div className="relative z-10">
          <h2 className="mb-8 text-3xl font-bold md:text-5xl">
            Ready to transform your coding skills?
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-400">
            Start your adaptive learning journey and improve your C programming
            skills with intelligent feedback.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="rounded-2xl bg-sky-600 px-12 py-5 font-bold text-white shadow-xl shadow-sky-900/40 transition-all hover:bg-sky-500"
          >
            Get Started for Free
          </button>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-sky-500/20 blur-[100px]"
        />
      </div>
    </section>
  );
};

export default FinalCTASection;
