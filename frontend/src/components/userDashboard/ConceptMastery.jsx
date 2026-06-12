import { BrainCircuit, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ConceptMastery = ({ items = [] }) => {
  const data = items || [];

  return (
    <section className="text-left">
      <div className="mb-6 flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
          <BrainCircuit size={22} className="text-sky-600" />
          Concept Mastery
        </h3>

        <Link
          to="/student/analytics"
          className="group flex items-center gap-1 text-sm font-bold text-sky-600 hover:underline"
        >
          View Detailed Analytics
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((stat, index) => (
          <div
            key={stat.concept || index}
            className="rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h4 className="font-bold text-slate-700">{stat.concept}</h4>

              <span className="whitespace-nowrap text-sm font-black text-sky-600">
                {stat.level}% Mastery
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-700"
                style={{ width: `${stat.level}%` }}
              />
            </div>
          </div>
        ))}

        {data.length === 0 && (
          <div className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-slate-400">
              No concept mastery data available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConceptMastery;
