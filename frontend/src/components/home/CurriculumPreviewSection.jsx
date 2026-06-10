import { ArrowRight } from "lucide-react";

const CurriculumPreviewSection = () => {
  const curriculum = [
    {
      module: "Module 1: C Basics",
      lessons: ["Variables", "Data Types", "Input / Output", "Operators"],
    },
    {
      module: "Module 2: Control Flow",
      lessons: ["If Conditions", "Switch Case", "For Loop", "While Loop"],
    },
    {
      module: "Module 3: Arrays & Functions",
      lessons: ["Arrays", "Functions", "Parameters", "Return Values"],
    },
  ];

  return (
    <section id="curriculum" className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
              Comprehensive C Curriculum
            </h2>

            <p className="text-slate-600">
              From basic syntax to advanced memory management, ProgFlex covers
              the key C programming concepts needed by ICT undergraduates.
            </p>
          </div>

          <button className="flex items-center gap-2 font-bold text-sky-600 transition-all hover:gap-3">
            View Full Curriculum <ArrowRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curriculum.map((module, index) => (
            <div
              key={index}
              className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <h3 className="mb-6 border-b border-slate-50 pb-4 font-bold text-slate-900">
                {module.module}
              </h3>

              <ul className="space-y-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li
                    key={lessonIndex}
                    className="flex items-center gap-3 text-sm text-slate-600"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CurriculumPreviewSection;
