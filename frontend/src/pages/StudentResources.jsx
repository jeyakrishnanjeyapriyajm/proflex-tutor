import {
  Download,
  FileText,
  Video,
  Library,
  Code2,
  Search,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";

const categories = [
  {
    title: "Lecture Notes",
    count: "12 Files",
    icon: FileText,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "Video Tutorials",
    count: "8 Videos",
    icon: Video,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    title: "Code Samples",
    count: "24 Snippets",
    icon: Code2,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

const uploads = [
  {
    name: "Introduction to C Programming.pdf",
    meta: "PDF • 2.4 MB • Uploaded 2 days ago",
    icon: FileText,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    name: "Input Output Functions Tutorial.mp4",
    meta: "Video • 45 MB • Uploaded 3 days ago",
    icon: Video,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    name: "Loop Practice Code Samples.zip",
    meta: "Archive • 1.2 MB • Uploaded 1 week ago",
    icon: Library,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "C Programming Cheat Sheet.pdf",
    meta: "PDF • 800 KB • Uploaded 1 week ago",
    icon: FileText,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
];

const StudentResources = () => {
  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <div className="min-h-[calc(100vh-120px)] bg-slate-50/50 font-sans">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Learning Resources
              </h1>

              <p className="mt-2 text-base font-medium text-slate-500">
                Access curated materials to support your programming journey.
              </p>
            </div>

            <div className="relative w-full lg:w-96">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search resources..."
                className="w-full rounded-2xl border border-slate-100 bg-white py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-200 focus:ring-4 focus:ring-sky-600/10"
              />
            </div>
          </div>

          {/* Category Cards */}
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="group cursor-pointer rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-100 hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${category.bg} ${category.color}`}
                  >
                    <Icon size={28} />
                  </div>

                  <h2 className="mb-1 text-xl font-black text-slate-900 transition-colors group-hover:text-sky-600">
                    {category.title}
                  </h2>

                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                    {category.count}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Recent Uploads */}
          <section>
            <div className="mb-6 flex items-center justify-between px-2">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Recent Uploads
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Latest study materials added for your C programming modules.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {uploads.map((file) => {
                const Icon = file.icon;

                return (
                  <div
                    key={file.name}
                    className="group flex flex-col gap-5 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-sky-100 hover:shadow-lg hover:shadow-slate-200/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${file.bg} ${file.color}`}
                      >
                        <Icon size={28} />
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900 sm:text-lg">
                          {file.name}
                        </h3>

                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400 sm:text-sm">
                          {file.meta}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                      aria-label={`Download ${file.name}`}
                    >
                      <Download size={24} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </PortalLayout>
  );
};

export default StudentResources;
