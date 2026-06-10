import { BrainCircuit } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      value: "5,000+",
      label: "Active Students",
    },
    {
      value: "82%",
      label: "Mastery Rate",
    },
    {
      value: "120k+",
      label: "Lessons Completed",
    },
    {
      value: "1.2M",
      label: "AI Hints Served",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-sky-600 px-6 py-24 text-white">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
                {stat.value}
              </div>

              <div className="text-sm font-medium uppercase tracking-widest text-sky-100">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BrainCircuit className="absolute -left-10 -top-10 h-64 w-64 text-white/10" />
    </section>
  );
};

export default StatsSection;
