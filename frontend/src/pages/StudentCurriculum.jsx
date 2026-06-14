import { useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";
import { studentCurriculumMockData } from "../data/studentCurriculumData";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Lock,
  Play,
  Sparkles,
  Video,
} from "lucide-react";

const typeIcon = {
  article: BookOpen,
  video: Video,
  lab: FlaskConical,
};

const getContent = (title) => ({
  overview:
    "This lesson explains the concept clearly with beginner-friendly examples and practice guidance.",
  sections: [
    {
      title: "Concept Explanation",
      body: `In this lesson, you will learn ${title}. This topic is important for writing correct and efficient C programs.`,
    },
    {
      title: "Why it is important",
      body: "Understanding this concept helps you solve programming problems step by step and avoid common beginner mistakes.",
    },
  ],
  tips: [
    "Read the syntax carefully.",
    "Practice with small examples.",
    "Try the MCQ assessment after learning.",
  ],
});

const StudentCurriculum = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const totalModules = studentCurriculumMockData.length;
  const completedModules = studentCurriculumMockData.filter(
    (m) => m.status === "completed",
  ).length;

  const backToList = () => {
    setSelectedModule(null);
    setSelectedMaterial(null);
  };

  const backToModule = () => {
    setSelectedMaterial(null);
  };

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      {!selectedModule && (
        <div className="space-y-8 text-left">
          <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-600">
                <Sparkles size={15} />
                Guided Learning Path
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                C Programming Curriculum
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Learn C programming through 18 structured modules. Open each
                module to view lessons, explanations, labs, and assessments.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
              <p className="text-xl font-black text-slate-900">
                {completedModules}/{totalModules}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Modules Completed
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-4">
            {studentCurriculumMockData.map((module) => {
              const locked = module.status === "locked";

              return (
                <div
                  key={module.id}
                  className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition ${
                    locked ? "opacity-70" : "hover:border-sky-200"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <button
                      disabled={locked}
                      onClick={() => setSelectedModule(module)}
                      className="flex flex-1 gap-5 text-left disabled:cursor-not-allowed"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-sm font-black text-slate-400">
                        {locked ? <Lock size={17} /> : module.moduleNo}
                      </div>

                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {module.title}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                              module.status === "completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : module.status === "in-progress"
                                  ? "bg-sky-50 text-sky-600"
                                  : module.status === "unlocked"
                                    ? "bg-amber-50 text-amber-600"
                                    : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {module.status}
                          </span>
                        </div>

                        <p className="max-w-3xl text-sm leading-6 text-slate-500">
                          {module.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {module.materials?.length || 0} Lessons
                          </span>

                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {module.duration}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="w-full lg:w-48">
                      <div className="mb-2 flex justify-between text-xs font-bold">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-sky-600">{module.progress}%</span>
                      </div>

                      <div className="mb-4 h-2 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-sky-500"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>

                      <button
                        disabled={locked}
                        onClick={() => setSelectedModule(module)}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold ${
                          locked
                            ? "bg-slate-100 text-slate-400"
                            : "bg-sky-600 text-white hover:bg-sky-700"
                        }`}
                      >
                        {locked ? "Locked" : "Open"}
                        {!locked && <ChevronRight size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedModule && !selectedMaterial && (
        <div className="space-y-8 text-left">
          <button
            onClick={backToList}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft size={18} />
            Back to Curriculum
          </button>

          <section className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-sky-600">
                  Module {selectedModule.moduleNo}
                </p>

                <h2 className="text-3xl font-bold text-slate-900">
                  {selectedModule.title}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                  {selectedModule.description}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-2xl font-black text-slate-900">
                  {selectedModule.progress}%
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Progress
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <h3 className="px-1 text-xl font-bold text-slate-900">Lessons</h3>

              {(selectedModule.materials || []).map((material) => {
                const Icon = typeIcon[material.type] || BookOpen;

                return (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    className="flex w-full items-center justify-between rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm hover:border-sky-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Icon size={20} />
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900">
                          {material.title}
                        </h4>
                        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {material.type} • {material.duration}
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                );
              })}
            </div>

            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[2rem] bg-slate-900 p-7 text-white">
                <h4 className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Concepts
                </h4>

                <div className="space-y-3">
                  {(selectedModule.concepts || []).map((concept) => (
                    <div
                      key={concept}
                      className="rounded-2xl bg-white/5 px-4 py-3 text-sm font-bold text-slate-200"
                    >
                      {concept}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-7">
                <h4 className="mb-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  Assessment
                </h4>

                <p className="mb-5 text-sm leading-6 text-emerald-800">
                  Complete the lessons and start adaptive MCQ practice for this
                  module.
                </p>

                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 text-sm font-bold text-white">
                  Start Assessment
                  <ArrowRight size={15} />
                </button>
              </div>
            </aside>
          </section>
        </div>
      )}

      {selectedModule && selectedMaterial && (
        <div className="mx-auto max-w-5xl text-left">
          <button
            onClick={backToModule}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft size={18} />
            Back to {selectedModule.title}
          </button>

          {(() => {
            const content = getContent(selectedMaterial.title);
            const Icon = typeIcon[selectedMaterial.type] || BookOpen;

            return (
              <div className="space-y-8">
                <section className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600">
                        {selectedMaterial.type}
                      </span>

                      <h1 className="mt-4 text-3xl font-bold text-slate-900">
                        {selectedMaterial.title}
                      </h1>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                        {content.overview}
                      </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-sky-600">
                      <Icon size={26} />
                    </div>
                  </div>
                </section>

                {content.sections.map((section, index) => (
                  <section
                    key={index}
                    className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm"
                  >
                    <h3 className="mb-3 text-xl font-bold text-slate-900">
                      {section.title}
                    </h3>

                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">
                      {section.body}
                    </p>
                  </section>
                ))}

                <section className="rounded-[2rem] bg-slate-900 p-8 text-white">
                  <h3 className="mb-5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Learning Tips
                  </h3>

                  <div className="space-y-3">
                    {content.tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-sm text-slate-300"
                      >
                        <CheckCircle2 size={16} className="text-sky-400" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </section>

                <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-bold text-white">
                  Launch Adaptive Challenge
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </PortalLayout>
  );
};

export default StudentCurriculum;
