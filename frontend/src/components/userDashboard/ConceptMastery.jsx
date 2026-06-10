import { BrainCircuit } from "lucide-react";

const ConceptMastery = ({ items = [] }) => {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between px-2">
        <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
          <BrainCircuit size={22} className="text-sky-600" />
          Concept Mastery
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((stat) => (
          <div
            key={stat.concept}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-bold text-slate-700">{stat.concept}</h4>
              <span className="text-sm font-black text-sky-600">
                {stat.level}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-50">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{ width: `${stat.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ConceptMastery;
