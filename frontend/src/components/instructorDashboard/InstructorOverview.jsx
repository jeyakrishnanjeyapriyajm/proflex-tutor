import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  Users,
} from "lucide-react";

import { getLecturerOverview } from "../../services/lecturerService";

const StatCard = ({ icon: Icon, label, value, helper, color }) => {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}
      >
        <Icon size={23} />
      </div>

      <p className="text-2xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-bold text-slate-500">{label}</p>

      {helper && (
        <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">
          {helper}
        </p>
      )}
    </div>
  );
};

const InstructorOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLecturerOverview();
      setOverview(data.overview || null);
    } catch (err) {
      console.error("LOAD LECTURER OVERVIEW ERROR:", err);
      setError(
        err.response?.data?.message || "Could not load lecturer dashboard.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-bold text-rose-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
          Loading lecturer dashboard...
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Students"
          value={overview?.totalStudents || 0}
          helper="Total active student accounts."
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          icon={BookOpen}
          label="Modules"
          value={overview?.totalModules || 0}
          helper="Active learning modules."
          color="bg-sky-50 text-sky-600"
        />

        <StatCard
          icon={ClipboardCheck}
          label="Questions"
          value={overview?.totalQuestions || 0}
          helper="Questions available in question bank."
          color="bg-indigo-50 text-indigo-600"
        />

        <StatCard
          icon={BrainCircuit}
          label="AI Decisions"
          value={overview?.qLearningDecisions || 0}
          helper="Q-learning decision logs."
          color="bg-purple-50 text-purple-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Total Attempts"
          value={overview?.totalAttempts || 0}
          helper="All submitted question attempts."
          color="bg-slate-50 text-slate-600"
        />

        <StatCard
          icon={CheckCircle2}
          label="Accuracy"
          value={`${overview?.overallAccuracy || 0}%`}
          helper={`${overview?.correctAttempts || 0} correct attempts.`}
          color="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          icon={AlertTriangle}
          label="Stuck Events"
          value={overview?.stuckAttempts || 0}
          helper="Times students were detected as stuck."
          color="bg-orange-50 text-orange-600"
        />

        <StatCard
          icon={BarChart3}
          label="Completed Progress"
          value={overview?.completedProgress || 0}
          helper="Completed module progress records."
          color="bg-sky-50 text-sky-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm xl:col-span-8">
          <h2 className="text-xl font-black text-slate-900">
            Module Monitoring
          </h2>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Module-level completion and attempt summary.
          </p>

          <div className="mt-6 space-y-4">
            {overview?.modules?.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                No modules found.
              </div>
            )}

            {overview?.modules?.map((module) => (
              <div
                key={module.moduleId}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">
                      {module.moduleName}
                    </p>
                    <p className="text-xs font-bold text-slate-400">
                      {module.questionCount} questions • {module.studentCount}{" "}
                      students
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-sky-600">
                    {module.completionRate}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-sky-500"
                    style={{ width: `${module.completionRate || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm xl:col-span-4">
          <h2 className="text-xl font-black text-slate-900">
            Recent Student Activity
          </h2>

          <div className="mt-6 space-y-4">
            {overview?.recentActivities?.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
                No recent activities found.
              </div>
            )}

            {overview?.recentActivities?.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <p className="font-black text-slate-900">{item.studentName}</p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.moduleName} • {item.concept}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                    {item.difficulty}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      item.isCorrect
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {item.isCorrect ? "Correct" : "Wrong"}
                  </span>

                  {item.isStuck && (
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                      Stuck
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default InstructorOverview;
