import {
  BrainCircuit,
  BarChart3,
  Code2,
  ClipboardCheck,
  Library,
  TrendingUp,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";

const Features = () => {
  const features = [
    {
      icon: BrainCircuit,
      title: "Adaptive Learning",
      text: "Students receive personalized support based on their performance, stuck points, and concept mastery.",
    },
    {
      icon: TrendingUp,
      title: "Concept Mastery Analysis",
      text: "The platform tracks mastery using correctness, response time, attempts, hint usage, and previous performance.",
    },
    {
      icon: BarChart3,
      title: "Predictive Performance Analytics",
      text: "Student progress data is used to identify weak areas and support timely intervention.",
    },
    {
      icon: Code2,
      title: "Coding Workspace",
      text: "Students can practice C programming tasks and improve their logical thinking step by step.",
    },
    {
      icon: ClipboardCheck,
      title: "Smart Assessments",
      text: "Each module contains MCQs arranged from easy to hard to support gradual learning.",
    },
    {
      icon: Library,
      title: "Learning Resources",
      text: "Students can access notes, videos, PDFs, explanations, and practice materials.",
    },
  ];

  return (
    <MainLayout>
      <section className="bg-gradient-to-br from-slate-950 to-sky-950 px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-sky-100">
            Platform Features
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight">
            AI-enhanced support for beginner C programming learners
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-slate-300">
            ProgFlex combines difficulty-based task giving, concept mastery
            tracking, stuck-point analysis, and Q-learning based intervention
            selection.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-10 text-center text-white">
          <h2 className="text-3xl font-black">Ready to start learning?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Create your account and begin your adaptive C programming journey.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default Features;
