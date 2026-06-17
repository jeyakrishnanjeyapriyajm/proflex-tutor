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
  RefreshCcw,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";

import {
  getMyAnalysisOverview,
  getMyModuleAnalysis,
} from "../services/studentAnalysisService";

const getStatusStyle = (status) => {
  if (status === "completed") return "bg-emerald-50 text-emerald-700";
  if (status === "in_progress") return "bg-sky-50 text-sky-700";
  if (status === "recovery") return "bg-amber-50 text-amber-700";
  if (status === "needs_review") return "bg-orange-50 text-orange-700";
  if (status === "stuck") return "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
};

const getDifficultyStyle = (level) => {
  if (level === "easy") return "bg-emerald-50 text-emerald-700";
  if (level === "medium") return "bg-amber-50 text-amber-700";
  if (level === "hard") return "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
};

const getMasteryStyle = (level) => {
  if (level === "high") return "bg-emerald-50 text-emerald-700";
  if (level === "medium") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
};

const formatNumber = (value, digits = 2) => {
  const number = Number(value) || 0;
  return number.toFixed(digits);
};

const formatPercent = (value) => {
  const number = Number(value) || 0;
  return `${number.toFixed(2)}%`;
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

const ProgressBar = ({ value, color = "bg-sky-500" }) => {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};

const EmptyBox = ({ message }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
      {message}
    </div>
  );
};

const StudentAnalytics = () => {
  const [overview, setOverview] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [analysis, setAnalysis] = useState(null);

  const [loadingOverview, setLoadingOverview] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

  const loadOverview = async () => {
    try {
      setLoadingOverview(true);
      setError("");

      const data = await getMyAnalysisOverview();
      const modules = data.overview || [];

      setOverview(modules);

      if (!selectedModuleId && modules.length > 0) {
        setSelectedModuleId(modules[0].moduleId);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your analytics list.",
      );
    } finally {
      setLoadingOverview(false);
    }
  };

  const loadModuleAnalysis = async (moduleId) => {
    if (!moduleId) return;

    try {
      setLoadingAnalysis(true);
      setError("");

      const data = await getMyModuleAnalysis(moduleId);
      setAnalysis(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your module analysis.",
      );
      setAnalysis(null);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      loadModuleAnalysis(selectedModuleId);
    }
  }, [selectedModuleId]);

  const moduleSummary = analysis?.moduleSummary || {};
  const bktSummary = analysis?.bktSummary || {};

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
              My Learning Performance
            </div>

            <h2 className="text-3xl font-bold text-slate-900">My Analytics</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View your own module performance, concept mastery, stuck events,
              BKT mastery progression, and AI support decisions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedModuleId}
              onChange={(event) => setSelectedModuleId(event.target.value)}
              className="rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm outline-none"
            >
              {overview.length === 0 && <option value="">No modules</option>}

              {overview.map((module) => (
                <option key={module.moduleId} value={module.moduleId}>
                  {module.moduleName} ({module.status})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                loadOverview();
                if (selectedModuleId) {
                  loadModuleAnalysis(selectedModuleId);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-black text-white shadow-sm"
            >
              <RefreshCcw size={18} />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {(loadingOverview || loadingAnalysis) && (
          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
            <p className="text-sm font-bold text-slate-500">
              Loading your analytics...
            </p>
          </div>
        )}

        {!loadingOverview && !loadingAnalysis && !analysis && (
          <EmptyBox message="No personal analytics data available yet. Complete a module attempt first." />
        )}

        {analysis && !loadingAnalysis && (
          <>
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={BookOpen}
                label="Module Questions"
                value={moduleSummary.totalQuestions || 0}
                helper="Active questions in this module."
              />

              <StatCard
                icon={Activity}
                label="My Attempts"
                value={moduleSummary.totalAttempts || 0}
                helper={`${moduleSummary.correctAttempts || 0} correct, ${
                  moduleSummary.wrongAttempts || 0
                } wrong.`}
              />

              <StatCard
                icon={TrendingUp}
                label="My Accuracy"
                value={formatPercent(moduleSummary.accuracyPercentage)}
                helper="Based on your submitted answers."
              />

              <StatCard
                icon={Trophy}
                label="Module Status"
                value={moduleSummary.status || "not_started"}
                helper={`Score: ${moduleSummary.score || 0}/${
                  moduleSummary.totalModuleQuestions || 0
                }`}
              />
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-8">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        My Concept Mastery
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Your mastery level by C programming concept.
                      </p>
                    </div>

                    <Award className="text-sky-600" size={24} />
                  </div>

                  <div className="space-y-5">
                    {analysis.conceptMastery?.length === 0 && (
                      <EmptyBox message="No concept mastery records yet." />
                    )}

                    {analysis.conceptMastery?.map((item) => (
                      <div key={item.concept}>
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              {item.concept}
                            </p>
                            <p className="text-xs font-semibold text-slate-400">
                              {item.attempts} attempts •{" "}
                              {formatPercent(item.accuracyPercentage)} accuracy
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getMasteryStyle(
                                item.masteryLevel,
                              )}`}
                            >
                              {item.masteryLevel}
                            </span>

                            <span className="text-sm font-black text-sky-600">
                              {formatPercent(item.averageMasteryPercentage)}
                            </span>
                          </div>
                        </div>

                        <ProgressBar
                          value={item.averageMasteryPercentage}
                          color="bg-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        My Question Performance
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Your performance for each question in the selected
                        module.
                      </p>
                    </div>

                    <Target className="text-sky-600" size={24} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="pb-4">Q No</th>
                          <th className="pb-4">Concept</th>
                          <th className="pb-4">Difficulty</th>
                          <th className="pb-4">Attempts</th>
                          <th className="pb-4">Accuracy</th>
                          <th className="pb-4">Hints</th>
                          <th className="pb-4">Stuck</th>
                          <th className="pb-4">Last Result</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analysis.questionPerformance?.map((question) => (
                          <tr
                            key={question.questionId}
                            className="border-b border-slate-50 text-sm"
                          >
                            <td className="py-4 font-black text-slate-900">
                              Q{question.orderNo}
                            </td>

                            <td className="py-4 font-bold text-slate-700">
                              {question.concept}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getDifficultyStyle(
                                  question.lecturerDifficulty,
                                )}`}
                              >
                                {question.lecturerDifficulty}
                              </span>
                            </td>

                            <td className="py-4">{question.totalAttempts}</td>

                            <td className="py-4">
                              {formatPercent(question.accuracyPercentage)}
                            </td>

                            <td className="py-4">{question.hintUsedCount}</td>

                            <td className="py-4 text-orange-600">
                              {question.stuckEvents}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  question.lastResult === "correct"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : question.lastResult === "wrong"
                                      ? "bg-rose-50 text-rose-700"
                                      : "bg-slate-50 text-slate-500"
                                }`}
                              >
                                {question.lastResult}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        My Recent Attempts
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Latest attempts from your adaptive task-giving flow.
                      </p>
                    </div>

                    <Clock className="text-sky-600" size={24} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="pb-4">Q No</th>
                          <th className="pb-4">Concept</th>
                          <th className="pb-4">Difficulty</th>
                          <th className="pb-4">Attempt No</th>
                          <th className="pb-4">Time</th>
                          <th className="pb-4">Hint</th>
                          <th className="pb-4">Stuck</th>
                          <th className="pb-4">Result</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analysis.recentAttempts?.length === 0 && (
                          <tr>
                            <td
                              colSpan="8"
                              className="py-8 text-center text-sm font-bold text-slate-400"
                            >
                              No attempts yet.
                            </td>
                          </tr>
                        )}

                        {analysis.recentAttempts?.map((attempt) => (
                          <tr
                            key={attempt.attemptId}
                            className="border-b border-slate-50 text-sm"
                          >
                            <td className="py-4 font-black text-slate-900">
                              Q{attempt.questionNo}
                            </td>

                            <td className="py-4 font-bold text-slate-700">
                              {attempt.concept}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getDifficultyStyle(
                                  attempt.difficulty,
                                )}`}
                              >
                                {attempt.difficulty}
                              </span>
                            </td>

                            <td className="py-4">{attempt.attemptNo}</td>
                            <td className="py-4">
                              {attempt.timeTakenSeconds}s
                            </td>
                            <td className="py-4">
                              {attempt.hintUsed ? "Yes" : "No"}
                            </td>
                            <td className="py-4">
                              {attempt.isStuck ? "Yes" : "No"}
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  attempt.isCorrect
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                                }`}
                              >
                                {attempt.isCorrect ? "Correct" : "Wrong"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <aside className="space-y-6 xl:col-span-4">
                <div className="rounded-[2rem] bg-slate-900 p-7 text-white shadow-xl shadow-slate-200">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black">
                        My Learning Summary
                      </h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Your progress in this module.
                      </p>
                    </div>

                    <BrainCircuit className="text-sky-400" size={26} />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white/5 p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-300">
                          Accuracy
                        </span>
                        <span className="font-black text-sky-300">
                          {formatPercent(moduleSummary.accuracyPercentage)}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-sky-400"
                          style={{
                            width: `${Math.min(
                              100,
                              moduleSummary.accuracyPercentage || 0,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <Flame className="mb-3 text-orange-400" size={22} />
                        <p className="text-2xl font-black">
                          {moduleSummary.stuckEvents || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400">
                          Stuck Events
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-4">
                        <Zap className="mb-3 text-yellow-400" size={22} />
                        <p className="text-2xl font-black">
                          {moduleSummary.hintUsedCount || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400">
                          Hints Used
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <h3 className="mb-6 text-xl font-black text-slate-900">
                    BKT Mastery
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-600">
                          Initial Mastery
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {formatNumber(bktSummary.initialMastery, 4)}
                        </p>
                      </div>
                      <ProgressBar
                        value={(bktSummary.initialMastery || 0) * 100}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-600">
                          Final Mastery
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {formatNumber(bktSummary.finalMastery, 4)}
                        </p>
                      </div>
                      <ProgressBar
                        value={(bktSummary.finalMastery || 0) * 100}
                        color="bg-emerald-500"
                      />
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                        Improvement
                      </p>
                      <p className="mt-1 text-2xl font-black text-emerald-700">
                        {formatNumber(bktSummary.improvement, 4)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <h3 className="mb-6 text-xl font-black text-slate-900">
                    My Q-Learning Support
                  </h3>

                  <div className="space-y-4">
                    {analysis.qLearningActions?.length === 0 && (
                      <EmptyBox message="No Q-learning support actions recorded yet." />
                    )}

                    {analysis.qLearningActions?.map((action) => (
                      <div
                        key={action.action}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-black text-slate-900">
                            {action.action}
                          </p>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                            {action.count} times
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-slate-500">
                          Average Reward:{" "}
                          <span className="font-black text-emerald-600">
                            {formatNumber(action.averageReward)}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <h3 className="mb-6 text-xl font-black text-slate-900">
                    AI Insights
                  </h3>

                  <div className="space-y-4">
                    {analysis.aiInsights?.length === 0 && (
                      <EmptyBox message="No insights available yet." />
                    )}

                    {analysis.aiInsights?.map((insight) => (
                      <div
                        key={insight.title}
                        className={`rounded-2xl border p-5 ${
                          insight.type === "success"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : insight.type === "warning"
                              ? "border-amber-100 bg-amber-50 text-amber-700"
                              : "border-sky-100 bg-sky-50 text-sky-700"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {insight.type === "success" ? (
                            <CheckCircle2 size={18} />
                          ) : insight.type === "warning" ? (
                            <AlertTriangle size={18} />
                          ) : (
                            <Award size={18} />
                          )}

                          <h4 className="font-black">{insight.title}</h4>
                        </div>

                        <p className="text-sm leading-6">
                          {insight.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentAnalytics;
