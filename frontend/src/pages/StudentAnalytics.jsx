import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";
import { getStudentAnalytics } from "../services/studentAnalyticsService";

const safeArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const clampPercent = (value) => {
  const number = safeNumber(value, 0);
  if (number < 0) return 0;
  if (number > 100) return 100;
  return Math.round(number);
};

const getStatusStyle = (status) => {
  if (status === "mastered") return "bg-emerald-50 text-emerald-700";
  if (status === "strong") return "bg-sky-50 text-sky-700";
  if (status === "good") return "bg-indigo-50 text-indigo-700";
  if (status === "improving") return "bg-amber-50 text-amber-700";
  if (status === "needs-practice") return "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
};

const getInsightIcon = (type) => {
  if (type === "success") return CheckCircle2;
  if (type === "warning") return AlertTriangle;
  return BrainCircuit;
};

const getInsightStyle = (type) => {
  if (type === "success") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (type === "warning") {
    return "border-amber-100 bg-amber-50 text-amber-700";
  }

  return "border-sky-100 bg-sky-50 text-sky-700";
};

const getAttemptStatusStyle = (status) => {
  if (status === "Completed") return "bg-emerald-50 text-emerald-600";
  if (status === "Needs Review") return "bg-rose-50 text-rose-600";
  if (status === "Recovery") return "bg-purple-50 text-purple-600";
  if (status === "Stuck") return "bg-amber-50 text-amber-600";
  return "bg-sky-50 text-sky-600";
};

const EmptyState = ({ message }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
      <p className="text-sm font-bold text-slate-400">{message}</p>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, helper }) => {
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
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

const ProgressBar = ({ value }) => {
  const width = clampPercent(value);

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-sky-500 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

const StudentAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const result = await getStudentAnalytics();
        setData(result.data);
      } catch (error) {
        console.error("Student analytics loading error:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to load analytics",
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <PortalLayout
        tabs={studentTabs}
        title="Student Portal"
        subtitle="C programming workspace"
      >
        <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Loading student analytics...
          </p>
        </div>
      </PortalLayout>
    );
  }

  if (errorMessage) {
    return (
      <PortalLayout
        tabs={studentTabs}
        title="Student Portal"
        subtitle="C programming workspace"
      >
        <div className="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-center shadow-sm">
          <p className="font-bold text-rose-700">{errorMessage}</p>
        </div>
      </PortalLayout>
    );
  }

  if (!data) {
    return (
      <PortalLayout
        tabs={studentTabs}
        title="Student Portal"
        subtitle="C programming workspace"
      >
        <div className="rounded-[2rem] border border-slate-100 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            No analytics data available yet.
          </p>
        </div>
      </PortalLayout>
    );
  }

  const summary = data.summary || {};
  const conceptMastery = safeArray(data.conceptMastery);
  const weeklyActivity = safeArray(data.weeklyActivity);
  const recentAttempts = safeArray(data.recentAttempts);
  const difficultyPerformance = safeArray(data.difficultyPerformance);
  const aiInsights = safeArray(data.aiInsights);
  const moduleProgress = safeArray(data.moduleProgress);

  const maxMinutes =
    weeklyActivity.length > 0
      ? Math.max(...weeklyActivity.map((item) => safeNumber(item.minutes)), 1)
      : 1;

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <div className="space-y-8 text-left">
        <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-sky-600">
              <BarChart3 size={16} />
              Learning Performance
            </div>

            <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track your C programming mastery, module progress, assessment
              performance, and AI-based learning insights.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
            <p className="text-xl font-black text-slate-900">
              {summary.currentLevel || "Beginner"}
            </p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Current Level
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Target}
            label="Overall Mastery"
            value={`${safeNumber(summary.overallMastery)}%`}
            helper="Based on your concept mastery and completed module attempts."
          />

          <StatCard
            icon={TrendingUp}
            label="Accuracy"
            value={`${safeNumber(summary.accuracy)}%`}
            helper="Your average MCQ correctness."
          />

          <StatCard
            icon={BookOpen}
            label="Modules Completed"
            value={`${safeNumber(summary.completedModules)}/${safeNumber(
              summary.totalModules,
            )}`}
            helper="Your C programming learning path progress."
          />

          <StatCard
            icon={Clock}
            label="Study Time"
            value={summary.studyTime || "0m"}
            helper={`${safeNumber(summary.totalAttempts)} total attempts.`}
          />
        </section>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-6 xl:col-span-8">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Concept Mastery
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    BKT-based mastery level for each C programming concept.
                  </p>
                </div>

                <Award className="text-sky-600" size={24} />
              </div>

              <div className="space-y-5">
                {conceptMastery.length > 0 ? (
                  conceptMastery.map((item) => (
                    <div key={item.concept}>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.concept}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {safeNumber(item.attempts)} attempts •{" "}
                            {safeNumber(item.accuracy)}% accuracy
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusStyle(
                              item.status,
                            )}`}
                          >
                            {(item.status || "needs-practice").replace(
                              "-",
                              " ",
                            )}
                          </span>

                          <span className="text-sm font-black text-sky-600">
                            {safeNumber(item.mastery)}%
                          </span>
                        </div>
                      </div>

                      <ProgressBar value={item.mastery} />
                    </div>
                  ))
                ) : (
                  <EmptyState message="Concept mastery will appear after you complete questions." />
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Module Progress
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your progress in each started module.
                  </p>
                </div>

                <BookOpen className="text-sky-600" size={24} />
              </div>

              <div className="space-y-5">
                {moduleProgress.length > 0 ? (
                  moduleProgress.map((item) => (
                    <div key={item.id}>
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.module}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {safeNumber(item.completedCount)}/
                            {safeNumber(item.totalQuestions)} questions •{" "}
                            {safeNumber(item.correctCount)} correct •{" "}
                            {safeNumber(item.wrongCount)} wrong
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getAttemptStatusStyle(
                              item.readableStatus,
                            )}`}
                          >
                            {item.readableStatus}
                          </span>

                          <span className="text-sm font-black text-sky-600">
                            {safeNumber(item.progressPercentage)}%
                          </span>
                        </div>
                      </div>

                      <ProgressBar value={item.progressPercentage} />
                    </div>
                  ))
                ) : (
                  <EmptyState message="Module progress will appear after you start a module." />
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Weekly Practice Activity
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Minutes spent and questions attempted this week.
                  </p>
                </div>

                <Activity className="text-sky-600" size={24} />
              </div>

              <div className="flex h-64 items-end gap-4 rounded-[1.5rem] bg-slate-50 p-5">
                {weeklyActivity.length > 0 ? (
                  weeklyActivity.map((item) => (
                    <div
                      key={item.day}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          className="w-full rounded-t-2xl bg-sky-500 transition-all"
                          style={{
                            height: `${Math.max(
                              (safeNumber(item.minutes) / maxMinutes) * 100,
                              safeNumber(item.minutes) > 0 ? 8 : 0,
                            )}%`,
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-black text-slate-700">
                          {item.day}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400">
                          {safeNumber(item.minutes)}m
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-center text-sm font-bold text-slate-400">
                    Weekly activity will appear after more practice.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Recent Assessment Attempts
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Latest attempts from the adaptive task-giving flow.
                  </p>
                </div>

                <Trophy className="text-sky-600" size={24} />
              </div>

              {recentAttempts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="pb-4">Module</th>
                        <th className="pb-4">Difficulty</th>
                        <th className="pb-4">Score</th>
                        <th className="pb-4">Accuracy</th>
                        <th className="pb-4">Time</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentAttempts.map((attempt) => (
                        <tr
                          key={attempt.id}
                          className="border-b border-slate-50 text-sm"
                        >
                          <td className="py-4 font-bold text-slate-900">
                            {attempt.module}
                          </td>

                          <td className="py-4">
                            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                              {attempt.difficulty}
                            </span>
                          </td>

                          <td className="py-4 font-bold text-slate-700">
                            {attempt.score}
                          </td>

                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{
                                    width: `${clampPercent(attempt.accuracy)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-black text-slate-500">
                                {safeNumber(attempt.accuracy)}%
                              </span>
                            </div>
                          </td>

                          <td className="py-4 font-semibold text-slate-500">
                            {attempt.time}
                          </td>

                          <td className="py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${getAttemptStatusStyle(
                                attempt.status,
                              )}`}
                            >
                              {attempt.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState message="Recent attempts will appear after you answer questions." />
              )}
            </div>
          </div>

          <aside className="space-y-6 xl:col-span-4">
            <div className="rounded-[2rem] bg-slate-900 p-7 text-white shadow-xl shadow-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black">Learning Summary</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Overall student progress.
                  </p>
                </div>

                <BrainCircuit className="text-sky-400" size={26} />
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white/5 p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">
                      Mastery
                    </span>
                    <span className="font-black text-sky-300">
                      {safeNumber(summary.overallMastery)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-sky-400"
                      style={{
                        width: `${clampPercent(summary.overallMastery)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <Flame className="mb-3 text-orange-400" size={22} />
                    <p className="text-2xl font-black">
                      {safeNumber(summary.streak)}
                    </p>
                    <p className="text-xs font-bold text-slate-400">
                      Day Streak
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <Zap className="mb-3 text-yellow-400" size={22} />
                    <p className="text-2xl font-black">
                      {safeNumber(summary.totalAttempts)}
                    </p>
                    <p className="text-xs font-bold text-slate-400">Attempts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                Difficulty Performance
              </h3>

              <div className="space-y-5">
                {difficultyPerformance.length > 0 ? (
                  difficultyPerformance.map((item) => (
                    <div key={item.level}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900">
                            {item.level}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {safeNumber(item.correct)} correct •{" "}
                            {safeNumber(item.wrong)} wrong
                          </p>
                        </div>

                        <span className="text-sm font-black text-sky-600">
                          {safeNumber(item.accuracy)}%
                        </span>
                      </div>

                      <ProgressBar value={item.accuracy} />
                    </div>
                  ))
                ) : (
                  <EmptyState message="Difficulty performance will appear after attempts." />
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                AI Insights
              </h3>

              <div className="space-y-4">
                {aiInsights.length > 0 ? (
                  aiInsights.map((insight) => {
                    const Icon = getInsightIcon(insight.type);

                    return (
                      <div
                        key={insight.title}
                        className={`rounded-2xl border p-5 ${getInsightStyle(
                          insight.type,
                        )}`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <Icon size={18} />
                          <h4 className="font-black">{insight.title}</h4>
                        </div>

                        <p className="text-sm leading-6">
                          {insight.description}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <EmptyState message="AI insights will appear after enough learning activity." />
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </PortalLayout>
  );
};

export default StudentAnalytics;
