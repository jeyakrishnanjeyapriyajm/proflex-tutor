import Card from "../common/Card";

const UserCourses = () => {
  const modules = [
    "C Basics",
    "Operators",
    "Conditional Statements",
    "Loops",
    "Arrays",
    "Functions",
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-black text-slate-900">
        C Programming Modules
      </h2>

      <div className="grid gap-5 md:grid-cols-3">
        {modules.map((module, index) => (
          <Card key={module} className="p-6">
            <span className="mb-4 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-600">
              Module {index + 1}
            </span>

            <h3 className="text-lg font-black text-slate-900">{module}</h3>

            <p className="mt-2 text-sm text-slate-500">
              10 MCQ questions arranged from easy to hard.
            </p>

            <button className="mt-5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600">
              Start Module
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserCourses;
