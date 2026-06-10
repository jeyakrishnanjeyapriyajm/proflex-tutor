import { BrainCircuit, Target, Users, GraduationCap } from "lucide-react";

import MainLayout from "../layouts/MainLayout";
import Card from "../components/common/Card";

const About = () => {
  const goals = [
    {
      icon: BrainCircuit,
      title: "Research Background",
      text: "ProgFlex is designed as an AI-enhanced assistive coding tutor for first-year undergraduate students learning C programming.",
    },
    {
      icon: Target,
      title: "Research Objective",
      text: "The main objective is to provide personalized support when students get stuck during structured learning tasks.",
    },
    {
      icon: GraduationCap,
      title: "Educational Focus",
      text: "The platform supports beginner programming learners through difficulty-based sequencing and concept mastery tracking.",
    },
    {
      icon: Users,
      title: "User Roles",
      text: "Students learn, lecturers manage learning content, and admins approve lecturers and manage the platform.",
    },
  ];

  return (
    <MainLayout>
      <section className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <span className="rounded-full bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
            About ProgFlex
          </span>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-900">
            AI-enhanced assistive coding tutor platform
          </h1>

          <p className="mt-6 max-w-3xl leading-7 text-slate-600">
            ProgFlex supports first-year undergraduate students by combining
            sequential C programming tasks, stuck-point analysis, concept
            mastery tracking, misconception analysis, and personalized
            intervention selection.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {goals.map((goal) => {
            const Icon = goal.icon;

            return (
              <Card key={goal.title} className="p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-slate-900">
                  {goal.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">{goal.text}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-slate-950 p-10 text-white">
          <h2 className="text-3xl font-black">Contact Information</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            This platform is developed as a research-based learning support
            system for C programming education.
          </p>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
