import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  RefreshCcw,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import {
  getAdminAnalysisOverview,
  getAdminModuleAnalysis,
} from "../../services/adminAnalysisService";

const formatPercent = (value) => {
  const number = Number(value) || 0;
  return `${number.toFixed(2)}%`;
};

const formatNumber = (value, digits = 2) => {
  const number = Number(value) || 0;
  return number.toFixed(digits);
};

const getStatusStyle = (status) => {
  if (status === "completed") return "bg-emerald-50 text-emerald-700";
  if (status === "in_progress") return "bg-sky-50 text-sky-700";
  if (status === "recovery") return "bg-amber-50 text-amber-700";
  if (status === "needs_review") return "bg-orange-50 text-orange-700";
  if (status === "stuck") return "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
};

const getDifficultyStyle = (difficulty) => {
  if (difficulty === "easy") return "bg-emerald-50 text-emerald-700";
  if (difficulty === "medium") return "bg-amber-50 text-amber-700";
  if (difficulty === "hard") return "bg-rose-50 text-rose-700";
  return "bg-slate-50 text-slate-600";
};

const getMasteryStyle = (level) => {
  if (level === "high") return "bg-emerald-50 text-emerald-700";
  if (level === "medium") return "bg-amber-50 text-amber-700";
  return "bg-rose-50 text-rose-700";
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

const EmptyBox = ({ message }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-bold text-slate-400">
      {message}
    </div>
  );
};

const AdminAnalysis = () => {
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

      const data = await getAdminAnalysisOverview();
      const modules = data.overview || [];

      setOverview(modules);

      if (!selectedModuleId && modules.length > 0) {
        setSelectedModuleId(modules[0].moduleId);
      }
    } catch (err) {
      console.error("LOAD ADMIN ANALYSIS OVERVIEW ERROR:", err);
      setError(
        err.response?.data?.message || "Could not load analysis overview.",
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

      const data = await getAdminModuleAnalysis(moduleId);
      setAnalysis(data);
    } catch (err) {
      console.error("LOAD ADMIN MODULE ANALYSIS ERROR:", err);
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
  const participantDistribution = analysis?.participantDistribution || {};

  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-black text-sky-600">
            <BarChart3 size={18} />
            Admin Research Analytics
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Student Performance Analysis
          </h2>

          <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-slate-500">
            View module-wise student performance, difficulty index, BKT mastery,
            stuck detection, concept mastery, and Q-learning decisions.
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
                {module.moduleName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              loadOverview();
              if (selectedModuleId) loadModuleAnalysis(selectedModuleId);
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
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
          Loading admin analysis...
        </div>
      )}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Module Students"
          value={moduleSummary.totalStudents || 0}
          helper="Students who attempted or started selected module."
        />

        <StatCard
          icon={BookOpen}
          label="Questions"
          value={moduleSummary.totalQuestions || 0}
          helper={moduleSummary.moduleName || "Selected module questions."}
        />

        <StatCard
          icon={Activity}
          label="Total Attempts"
          value={moduleSummary.totalAttempts || 0}
          helper={`${moduleSummary.totalCorrect || 0} correct, ${
            moduleSummary.totalWrong || 0
          } wrong.`}
        />

        <StatCard
          icon={TrendingUp}
          label="Overall Accuracy"
          value={formatPercent(moduleSummary.overallAccuracy)}
          helper="Correct attempts divided by total attempts."
        />
      </section>

      {analysis && !loadingAnalysis && (
        <>
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={CheckCircle2}
              label="Completed Students"
              value={moduleSummary.completedStudents || 0}
              helper="Students who completed the module."
            />

            <StatCard
              icon={AlertTriangle}
              label="Stuck Events"
              value={stuckSummary.totalStuckEvents || 0}
              helper={`Average: ${stuckSummary.averagePerStudent || 0} per student.`}
            />

            <StatCard
              icon={BrainCircuit}
              label="BKT Improvement"
              value={formatNumber(bktSummary.averageImprovement || 0, 4)}
              helper="Average final mastery minus initial mastery."
            />

            <StatCard
              icon={Zap}
              label="Interventions"
              value={stuckSummary.interventionsTriggered || 0}
              helper="Adaptive support actions triggered."
            />
          </section>

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-8">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="text-xl font-black text-slate-900">
                  Student Module Performance
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Individual student progress for the selected module.
                </p>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="pb-4">Student</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4">Score</th>
                        <th className="pb-4">Completed</th>
                        <th className="pb-4">Attempts</th>
                        <th className="pb-4">Accuracy</th>
                        <th className="pb-4">Stuck</th>
                      </tr>
                    </thead>

                    <tbody>
                      {analysis.studentPerformance?.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="py-8 text-center text-sm font-bold text-slate-400"
                          >
                            No student performance data found.
                          </td>
                        </tr>
                      )}

                      {analysis.studentPerformance?.map((student) => (
                        <tr
                          key={student.studentId}
                          className="border-b border-slate-50 text-sm"
                        >
                          <td className="py-4">
                            <p className="font-black text-slate-900">
                              {student.studentName || "Student"}
                            </p>
                            <p className="text-xs font-semibold text-slate-400">
                              {student.email || "-"}
                            </p>
                          </td>

                          <td className="py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black ${getStatusStyle(
                                student.moduleStatus,
                              )}`}
                            >
                              {student.moduleStatus}
                            </span>
                          </td>

                          <td className="py-4 font-black text-slate-800">
                            {student.score || 0}
                          </td>

                          <td className="py-4">
                            {student.completedCount || 0}/
                            {student.totalQuestions || 0}
                          </td>

                          <td className="py-4">{student.totalAttempts || 0}</td>

                          <td className="py-4">
                            {formatPercent(student.accuracyPercentage)}
                          </td>

                          <td className="py-4 text-orange-600">
                            {student.stuckEvents || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="text-xl font-black text-slate-900">
                  Question Difficulty Index Analysis
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Dynamic difficulty level calculated from correctness rate.
                </p>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[950px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="pb-4">Q No</th>
                        <th className="pb-4">Concept</th>
                        <th className="pb-4">Lecturer</th>
                        <th className="pb-4">Correct</th>
                        <th className="pb-4">Attempts</th>
                        <th className="pb-4">Difficulty Index</th>
                        <th className="pb-4">Dynamic Level</th>
                        <th className="pb-4">Match</th>
                      </tr>
                    </thead>

                    <tbody>
                      {analysis.questionDifficultyAnalysis?.length === 0 && (
                        <tr>
                          <td
                            colSpan="8"
                            className="py-8 text-center text-sm font-bold text-slate-400"
                          >
                            No question difficulty data found.
                          </td>
                        </tr>
                      )}

                      {analysis.questionDifficultyAnalysis?.map((question) => (
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

                          <td className="py-4">
                            {question.correctStudents || 0}
                          </td>

                          <td className="py-4">
                            {question.totalStudents || 0}
                          </td>

                          <td className="py-4 font-black text-slate-800">
                            {formatNumber(question.difficultyIndex, 2)}
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
                            {question.matchedLecturerLabel ? (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                                Match
                              </span>
                            ) : (
                              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">
                                Different
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="text-xl font-black text-slate-900">
                  Concept-Level Mastery
                </h3>

                <div className="mt-6 space-y-4">
                  {analysis.conceptMastery?.length === 0 && (
                    <EmptyBox message="No concept mastery data found." />
                  )}

                  {analysis.conceptMastery?.map((item) => (
                    <div
                      key={item.concept}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-black text-slate-900">
                            {item.concept}
                          </p>
                          <p className="text-xs font-bold text-slate-400">
                            Average mastery:{" "}
                            {formatPercent(item.averageMasteryPercentage)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${getMasteryStyle(
                            item.masteryLevel,
                          )}`}
                        >
                          {item.masteryLevel}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${Math.min(
                              100,
                              Number(item.averageMasteryPercentage) || 0,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-8 xl:col-span-4">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="mb-6 text-xl font-black text-slate-900">
                  Participant Distribution
                </h3>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Total Students
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {participantDistribution.totalStudents || 0}
                    </p>
                  </div>

                  {participantDistribution.genderDistribution?.map((item) => (
                    <div
                      key={item.category}
                      className="rounded-2xl border border-slate-100 bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-black text-slate-700">
                          {item.category}
                        </p>
                        <p className="text-sm font-black text-sky-600">
                          {item.count} ({item.percentage}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="mb-6 text-xl font-black text-slate-900">
                  BKT Mastery Summary
                </h3>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Average Initial Mastery
                    </p>
                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {formatNumber(bktSummary.averageInitialMastery, 4)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      Average Final Mastery
                    </p>
                    <p className="mt-1 text-2xl font-black text-emerald-700">
                      {formatNumber(bktSummary.averageFinalMastery, 4)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-sky-50 p-5">
                    <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                      Average Improvement
                    </p>
                    <p className="mt-1 text-2xl font-black text-sky-700">
                      {formatNumber(bktSummary.averageImprovement, 4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="mb-6 text-xl font-black text-slate-900">
                  Difficulty Summary
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                    <p className="text-2xl font-black text-emerald-700">
                      {difficultySummary.easy || 0}
                    </p>
                    <p className="text-[10px] font-black uppercase text-emerald-600">
                      Easy
                    </p>
                  </div>

                  <div className="rounded-2xl bg-amber-50 p-4 text-center">
                    <p className="text-2xl font-black text-amber-700">
                      {difficultySummary.medium || 0}
                    </p>
                    <p className="text-[10px] font-black uppercase text-amber-600">
                      Medium
                    </p>
                  </div>

                  <div className="rounded-2xl bg-rose-50 p-4 text-center">
                    <p className="text-2xl font-black text-rose-700">
                      {difficultySummary.hard || 0}
                    </p>
                    <p className="text-[10px] font-black uppercase text-rose-600">
                      Hard
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Lecturer Label Match
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {formatPercent(difficultySummary.matchPercentage)}
                  </p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
                <h3 className="mb-6 text-xl font-black text-slate-900">
                  Q-Learning Decisions
                </h3>

                <div className="space-y-4">
                  {analysis.qLearningActions?.length === 0 && (
                    <EmptyBox message="No Q-learning actions found." />
                  )}

                  {analysis.qLearningActions?.map((action) => (
                    <div
                      key={action.action}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="font-black text-slate-900">
                          {action.action}
                        </p>

                        <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-500">
                          {action.count || 0}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-slate-500">
                        Average Reward:{" "}
                        <span className="font-black text-emerald-600">
                          {formatNumber(action.averageReward, 2)}
                        </span>
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
  );
};

export default AdminAnalysis;
