import { Play, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResumeLearningCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-sky-600 p-8 text-left text-white shadow-xl shadow-sky-200">
      <div className="relative z-10">
        <Sparkles size={32} className="mb-6 opacity-80" />

        <h3 className="mb-3 text-2xl font-bold leading-tight">
          {data?.title || "Ready to Code?"}
        </h3>

        <p className="mb-8 text-sm leading-relaxed text-sky-100">
          Continue your session on{" "}
          <span className="font-bold">
            {data?.module || "Loops (For/While/Do)"}
          </span>{" "}
          and earn {data?.bonusXp || 50} bonus XP.
        </p>

        <button
          onClick={() => navigate("/student/workspace")}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4 font-bold text-sky-600 shadow-lg transition-all hover:bg-sky-50 group-hover:scale-[1.02]"
        >
          {data?.buttonText || "Resume Workspace"}
          <Play size={18} fill="currentColor" />
        </button>
      </div>

      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
};

export default ResumeLearningCard;
