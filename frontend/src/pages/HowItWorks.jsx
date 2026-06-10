import {
  UserPlus,
  BookOpen,
  ClipboardCheck,
  BrainCircuit,
  TrendingUp,
  RefreshCcw,
} from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      text: "Students register directly. Lecturers request access and wait for admin approval.",
    },
    {
      icon: BookOpen,
      title: "Complete Curriculum",
      text: "Students follow C programming modules arranged from basic concepts to advanced topics.",
    },
    {
      icon: ClipboardCheck,
      title: "Practice & Assessments",
      text: "Each module includes MCQs and practice tasks arranged from easy to hard.",
    },
    {
      icon: BrainCircuit,
      title: "Stuck Point Analysis",
      text: "When a student struggles, the system checks attempts, time, hints, wrong options, and mastery level.",
    },
    {
      icon: TrendingUp,
      title: "Mastery Tracking",
      text: "The platform updates concept-level mastery after each learning interaction.",
    },
    {
      icon: RefreshCcw,
      title: "Continuous Improvement",
      text: "Q-learning helps choose better support actions over repeated student interactions.",
    },
  ];

  return (
    <MainLayout>
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl text-center">
          <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
            How It Works
          </span>

          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-900">
            A simple adaptive learning flow for C programming
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-600">
            The platform starts with structured task giving and applies
            Q-learning only when personalized intervention is needed.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card key={step.title} className="p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                      <Icon size={26} />
                    </div>

                    <span className="text-4xl font-black text-slate-100">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-100 bg-white p-10 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900">
            Student journey and lecturer journey work together
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h3 className="font-black text-slate-900">Student Journey</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Students learn through sequential C modules, answer MCQs, get
                support when stuck, and improve concept mastery over time.
              </p>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <h3 className="font-black text-slate-900">Lecturer Journey</h3>
              <p className="mt-3 leading-7 text-slate-600">
                Lecturers monitor student progress, manage questions, review
                analytics, and support students who need intervention.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HowItWorks;
