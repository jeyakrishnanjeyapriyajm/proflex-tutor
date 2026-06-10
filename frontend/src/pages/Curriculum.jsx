import { BookOpen, Target, ClipboardCheck, TrendingUp } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";

const Curriculum = () => {
  const modules = [
    "Introduction to C",
    "Variables and Data Types",
    "Operators and Expressions",
    "Conditional Statements",
    "Loops",
    "Arrays",
    "Functions",
    "Pointers",
    "Strings",
    "Structures",
  ];

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-slate-950 to-sky-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-sky-100">
            Curriculum
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight">
            C programming curriculum for first-year undergraduates
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-slate-300">
            Modules are arranged to support beginner learners step by step. Each
            module can contain 10 MCQ questions from easy to hard.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <Card className="p-8">
            <BookOpen className="mb-5 text-sky-600" size={32} />
            <h3 className="text-xl font-black text-slate-900">
              Module Overview
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Each module focuses on one major C programming concept.
            </p>
          </Card>

          <Card className="p-8">
            <Target className="mb-5 text-sky-600" size={32} />
            <h3 className="text-xl font-black text-slate-900">
              Learning Outcomes
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              Outcomes help students understand what they should master in each
              topic.
            </p>
          </Card>

          <Card className="p-8">
            <ClipboardCheck className="mb-5 text-sky-600" size={32} />
            <h3 className="text-xl font-black text-slate-900">
              Assessment Structure
            </h3>
            <p className="mt-3 leading-7 text-slate-600">
              MCQs and practice tasks help identify mastery and stuck points.
            </p>
          </Card>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center gap-3">
            <TrendingUp className="text-sky-600" />
            <h2 className="text-3xl font-black text-slate-900">
              Learning Roadmap
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {modules.map((module, index) => (
              <div
                key={module}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
              >
                <span className="mb-4 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                  Module {index + 1}
                </span>

                <h3 className="font-black text-slate-900">{module}</h3>

                <p className="mt-2 text-sm text-slate-500">
                  10 MCQs from easy to hard.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Curriculum;
