import { useEffect, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  Code2,
  Play,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";
import { PRACTICE_CONTENT } from "../data/learningContent";

const StudentWorkspace = () => {
  const concepts = Object.keys(PRACTICE_CONTENT);
  const [activeConcept, setActiveConcept] = useState(concepts[0]);
  const content = PRACTICE_CONTENT[activeConcept];

  const [code, setCode] = useState(content?.initialCode || "");
  const [output, setOutput] = useState([
    "Workspace ready.",
    "Click Run Code to simulate output.",
  ]);

  useEffect(() => {
    setCode(content?.initialCode || "");
    setOutput(["Workspace ready.", "Click Run Code to simulate output."]);
  }, [activeConcept, content?.initialCode]);

  const handleRunCode = () => {
    setOutput([
      "Compiling using GCC 11.4.0...",
      "> Program compiled successfully.",
      "> Execution time: 0.002s",
      "> Output generated successfully.",
    ]);
  };

  const handleReset = () => {
    setCode(content?.initialCode || "");
    setOutput(["Code reset to starter template."]);
  };

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 shadow-2xl shadow-slate-200">
        <header className="flex flex-col gap-4 border-b border-slate-700 bg-slate-800 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
              <Code2 size={20} />
            </div>

            <div>
              <h2 className="text-sm font-bold leading-tight text-white">
                {content?.title || "C Programming Lab"}
              </h2>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Interactive Coding Workspace
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-600">
              <Save size={14} />
              Save Draft
            </button>

            <button
              onClick={handleRunCode}
              className="flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/20 transition hover:bg-sky-500"
            >
              <Play size={14} fill="currentColor" />
              Run Code
            </button>
          </div>
        </header>

        <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-12">
          <aside className="border-b border-slate-700 bg-slate-800 p-6 lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="mb-6">
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">
                Practice Concepts
              </span>

              <h3 className="mt-4 text-2xl font-bold text-white">
                Current Lesson
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Choose a concept and practice C programming with starter code,
                task instructions, and AI tutor guidance.
              </p>
            </div>

            <div className="mb-8 space-y-2">
              {concepts.map((concept) => (
                <button
                  key={concept}
                  onClick={() => setActiveConcept(concept)}
                  className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                    activeConcept === concept
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-950/20"
                      : "bg-slate-900/40 text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {concept}
                  <BookOpen size={16} />
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-sky-400">
                  <Sparkles size={14} />
                  The Task
                </h4>

                <p className="text-sm leading-relaxed text-white">
                  {content?.task}
                </p>
              </div>

              <div>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                  Core Concepts
                </h4>

                <div className="flex flex-wrap gap-2">
                  {(content?.concepts || []).map((concept) => (
                    <span
                      key={concept}
                      className="rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-1.5 text-[10px] font-bold text-slate-300"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-sky-900/30 bg-sky-900/20 p-6">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-sky-400">
                  <BrainCircuit size={16} />
                  AI Tutor Tip
                </h4>

                <p className="text-xs italic leading-loose text-sky-100/70">
                  Remember that in C, every statement must end with a semicolon.
                  Read compiler errors carefully before changing your logic.
                </p>
              </div>
            </div>
          </aside>

          <main className="flex flex-col bg-slate-900 lg:col-span-8">
            <div className="border-b border-slate-800 px-6 py-4">
              <h1 className="text-xl font-bold text-white">{content?.title}</h1>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {content?.description}
              </p>
            </div>

            <div className="min-h-[420px] flex-1 p-6">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="h-full min-h-[420px] w-full resize-none rounded-3xl border border-slate-800 bg-slate-950 p-6 font-mono text-sm leading-relaxed text-sky-100 outline-none focus:border-sky-700 focus:ring-4 focus:ring-sky-900/20"
              />
            </div>

            <div className="border-t border-slate-800 bg-slate-950 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Output Console
                </h4>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 transition hover:text-white"
                >
                  <RotateCcw size={12} />
                  Reset Buffer
                </button>
              </div>

              <div className="min-h-28 rounded-2xl border border-slate-800 bg-slate-900 p-5 font-mono text-xs text-emerald-400">
                {output.map((line, index) => (
                  <p
                    key={index}
                    className={index === 0 ? "opacity-60" : "mt-2"}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentWorkspace;
