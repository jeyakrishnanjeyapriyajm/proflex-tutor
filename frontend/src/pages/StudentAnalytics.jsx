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
  Users,
  Zap,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { studentTabs } from "../data/portalTabs";

import {
  getAnalysisOverview,
  getModuleAnalysis,
} from "../services/analysisService";

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

      const data = await getAnalysisOverview();
      const modules = data.overview || [];

      setOverview(modules);

      if (!selectedModuleId && modules.length > 0) {
        setSelectedModuleId(modules[0].moduleId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not load analytics list.");
    } finally {
      setLoadingOverview(false);
    }
  };

  const loadModuleAnalysis = async (moduleId) => {
    if (!moduleId) return;

    try {
      setLoadingAnalysis(true);
      setError("");

      const data = await getModuleAnalysis(moduleId);
      setAnalysis(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load module analysis.",
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
  const difficultySummary = analysis?.difficultySummary || {};
  const bktSummary = analysis?.bktSummary || {};
  const stuckSummary = analysis?.stuckSummary || {};

  const totalStudents = moduleSummary.totalStudents || 0;
  const overallAccuracy = moduleSummary.overallAccuracy || 0;
  const totalQuestions = moduleSummary.totalQuestions || 0;
  const totalAttempts = moduleSummary.totalAttempts || 0;

  const completedStudents = moduleSummary.completedStudents || 0;
  const completionRate =
    totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;

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
              Track module performance, difficulty analysis, BKT mastery, stuck
              detection, concept-level mastery, and Q-learning decisions.
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
                  {module.moduleName} ({module.questionCount} Questions)
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
              Loading analytics...
            </p>
          </div>
        )}

        {!loadingOverview && !loadingAnalysis && !analysis && (
          <EmptyBox message="No analytics data available yet. Complete some module attempts first." />
        )}

        {analysis && !loadingAnalysis && (
          <>
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                icon={Users}
                label="Students"
                value={totalStudents}
                helper="Students with attempts or progress records."
              />

              <StatCard
                icon={BookOpen}
                label="Questions"
                value={totalQuestions}
                helper="Active questions in this module."
              />

              <StatCard
                icon={TrendingUp}
                label="Overall Accuracy"
                value={formatPercent(overallAccuracy)}
                helper={`${totalAttempts} total attempts.`}
              />

              <StatCard
                icon={Trophy}
                label="Completion Rate"
                value={formatPercent(completionRate)}
                helper={`${completedStudents}/${totalStudents} students completed.`}
              />
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
              <div className="space-y-6 xl:col-span-8">
                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        Student Performance by Module
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Attempts, accuracy, stuck events, hint usage, and module
                        status.
                      </p>
                    </div>

                    <Activity className="text-sky-600" size={24} />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="pb-4">Student</th>
                          <th className="pb-4">Attempts</th>
                          <th className="pb-4">Correct</th>
                          <th className="pb-4">Wrong</th>
                          <th className="pb-4">Accuracy</th>
                          <th className="pb-4">Stuck</th>
                          <th className="pb-4">Hints</th>
                          <th className="pb-4">Avg Time</th>
                          <th className="pb-4">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analysis.studentPerformance?.length === 0 && (
                          <tr>
                            <td
                              colSpan="9"
                              className="py-8 text-center text-sm font-bold text-slate-400"
                            >
                              No student performance records yet.
                            </td>
                          </tr>
                        )}

                        {analysis.studentPerformance?.map((student) => (
                          <tr
                            key={student.studentId}
                            className="border-b border-slate-50 text-sm"
                          >
                            <td className="py-4 font-bold text-slate-900">
                              {student.studentName}
                              <p className="text-xs font-semibold text-slate-400">
                                {student.email || "No email"}
                              </p>
                            </td>

                            <td className="py-4 font-bold text-slate-700">
                              {student.totalAttempts}
                            </td>

                            <td className="py-4 font-bold text-emerald-600">
                              {student.correctAttempts}
                            </td>

                            <td className="py-4 font-bold text-rose-600">
                              {student.wrongAttempts}
                            </td>

                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Number(student.accuracyPercentage) || 0,
                                      )}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-black text-slate-500">
                                  {formatPercent(student.accuracyPercentage)}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 font-bold text-orange-600">
                              {student.stuckEvents}
                            </td>

                            <td className="py-4 font-bold text-slate-600">
                              {student.hintUsedCount}
                            </td>

                            <td className="py-4 font-semibold text-slate-500">
                              {formatNumber(student.averageTimeSeconds)}s
                            </td>

                            <td className="py-4">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                                  student.moduleStatus,
                                )}`}
                              >
                                {student.moduleStatus}
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
                        Question Difficulty Index Analysis
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Difficulty Index = correct students / total students
                        attempted.
                      </p>
                    </div>

                    <Target className="text-sky-600" size={24} />
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-emerald-50 p-5">
                      <p className="text-2xl font-black text-emerald-700">
                        {difficultySummary.easy || 0}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                        Easy
                      </p>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-5">
                      <p className="text-2xl font-black text-amber-700">
                        {difficultySummary.medium || 0}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-amber-600">
                        Medium
                      </p>
                    </div>

                    <div className="rounded-2xl bg-rose-50 p-5">
                      <p className="text-2xl font-black text-rose-700">
                        {difficultySummary.hard || 0}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-rose-600">
                        Hard
                      </p>
                    </div>

                    <div className="rounded-2xl bg-sky-50 p-5">
                      <p className="text-2xl font-black text-sky-700">
                        {formatPercent(difficultySummary.matchPercentage)}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                        Lecturer Match
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="pb-4">Q No</th>
                          <th className="pb-4">Concept</th>
                          <th className="pb-4">Correct</th>
                          <th className="pb-4">Total</th>
                          <th className="pb-4">DI</th>
                          <th className="pb-4">Dynamic</th>
                          <th className="pb-4">Lecturer</th>
                          <th className="pb-4">Match</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analysis.questionDifficultyAnalysis?.map(
                          (question) => (
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
                                {question.correctStudents}
                              </td>
                              <td className="py-4">{question.totalStudents}</td>

                              <td className="py-4 font-black text-slate-700">
                                {formatNumber(question.difficultyIndex)}
                              </td>

                              <td className="py-4">
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-bold ${getDifficultyStyle(
                                    question.dynamicLevel,
                                  )}`}
                                >
                                  {question.dynamicLevel}
                                </span>
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

                              <td className="py-4">
                                {question.matchedLecturerLabel ? (
                                  <span className="text-xs font-black text-emerald-600">
                                    Yes
                                  </span>
                                ) : (
                                  <span className="text-xs font-black text-rose-600">
                                    No
                                  </span>
                                )}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        BKT Mastery Progression
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Initial and final mastery probability from model
                        decision logs.
                      </p>
                    </div>

                    <BrainCircuit className="text-sky-600" size={24} />
                  </div>

                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-2xl font-black text-slate-900">
                        {formatNumber(bktSummary.averageInitialMastery, 4)}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Avg Initial
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-2xl font-black text-slate-900">
                        {formatNumber(bktSummary.averageFinalMastery, 4)}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Avg Final
                      </p>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 p-5">
                      <p className="text-2xl font-black text-emerald-700">
                        {formatNumber(bktSummary.averageImprovement, 4)}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                        Improvement
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <th className="pb-4">Student</th>
                          <th className="pb-4">Initial</th>
                          <th className="pb-4">Final</th>
                          <th className="pb-4">Improvement</th>
                        </tr>
                      </thead>

                      <tbody>
                        {analysis.bktMasteryProgression?.map((student) => (
                          <tr
                            key={student.studentId}
                            className="border-b border-slate-50 text-sm"
                          >
                            <td className="py-4 font-bold text-slate-900">
                              {student.studentName}
                            </td>
                            <td className="py-4">
                              {formatNumber(student.initialMastery, 4)}
                            </td>
                            <td className="py-4">
                              {formatNumber(student.finalMastery, 4)}
                            </td>
                            <td className="py-4 font-black text-emerald-600">
                              {formatNumber(student.improvement, 4)}
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
                      <h3 className="text-xl font-black">Learning Summary</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        Module-level student progress.
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
                          {formatPercent(overallAccuracy)}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-sky-400"
                          style={{
                            width: `${Math.min(100, overallAccuracy)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-white/5 p-4">
                        <Flame className="mb-3 text-orange-400" size={22} />
                        <p className="text-2xl font-black">
                          {stuckSummary.totalStuckEvents || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400">
                          Stuck Events
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/5 p-4">
                        <Zap className="mb-3 text-yellow-400" size={22} />
                        <p className="text-2xl font-black">
                          {stuckSummary.interventionsTriggered || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400">
                          Interventions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                  <h3 className="mb-6 text-xl font-black text-slate-900">
                    Concept Mastery
                  </h3>

                  <div className="space-y-5">
                    {analysis.conceptMastery?.length === 0 && (
                      <EmptyBox message="No concept mastery records yet." />
                    )}

                    {analysis.conceptMastery?.map((item) => (
                      <div key={item.concept}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              {item.concept}
                            </p>
                            <p className="text-xs font-semibold text-slate-400">
                              Avg mastery{" "}
                              {formatPercent(item.averageMasteryPercentage)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${getMasteryStyle(
                              item.masteryLevel,
                            )}`}
                          >
                            {item.masteryLevel}
                          </span>
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
                  <h3 className="mb-6 text-xl font-black text-slate-900">
                    Q-Learning Decisions
                  </h3>

                  <div className="space-y-4">
                    {analysis.qLearningActions?.length === 0 && (
                      <EmptyBox message="No Q-learning actions recorded yet." />
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
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-emerald-700">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 size={18} />
                        <h4 className="font-black">Difficulty Analysis</h4>
                      </div>
                      <p className="text-sm leading-6">
                        {difficultySummary.matchPercentage
                          ? `${formatPercent(
                              difficultySummary.matchPercentage,
                            )} of dynamic difficulty labels matched lecturer labels.`
                          : "Difficulty analysis will improve after more students attempt questions."}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-amber-700">
                      <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        <h4 className="font-black">Stuck Detection</h4>
                      </div>
                      <p className="text-sm leading-6">
                        {stuckSummary.totalStuckEvents || 0} stuck events were
                        detected in this module. The system triggered{" "}
                        {stuckSummary.interventionsTriggered || 0} adaptive
                        support actions.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sky-700">
                      <div className="mb-3 flex items-center gap-2">
                        <Award size={18} />
                        <h4 className="font-black">BKT Mastery</h4>
                      </div>
                      <p className="text-sm leading-6">
                        Average mastery improved by{" "}
                        {formatNumber(bktSummary.averageImprovement, 4)} based
                        on the recorded model decision logs.
                      </p>
                    </div>
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
