import { useSelector } from "react-redux";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
  Activity,
} from "lucide-react";

import Card from "../common/Card";

const getMasteryColor = (level) => {
  if (level === "high") return "bg-emerald-50 text-emerald-700";
  if (level === "medium") return "bg-amber-50 text-amber-700";
  return "bg-red-50 text-red-700";
};

const formatAction = (action = "") => {
  if (!action) return "No adaptive action yet";
  return action.replaceAll("_", " ");
};

const AdaptiveAssessmentPanel = () => {
  const {
    progress,
    result,
    support,
    qLearning,
    currentQuestion,
    selectedModule,
  } = useSelector((state) => state.taskGiving);

  const conceptMastery = progress?.conceptMastery || [];

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-purple-700">
              <Brain size={14} />
              Adaptive Assessment
            </div>

            <h1 className="text-2xl font-black text-slate-900">
              Difficulty Analysis & Adaptive Support
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              This section shows the student’s current mastery, stuck status,
              misconception, and Q-learning support decision.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Current Module
            </p>
            <p className="mt-1 text-lg font-black text-slate-900">
              {selectedModule?.title || selectedModule?.name || "Not selected"}
            </p>
          </div>
        </div>
      </Card>

      {!progress && (
        <Card className="p-8 text-center">
          <BookOpen size={36} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-xl font-black text-slate-900">
            No assessment data yet
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Start a module from the Task Giving section first. After answering
            questions, the adaptive assessment data will appear here.
          </p>
        </Card>
      )}

      {progress && (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Overall Mastery
                  </p>
                  <p className="mt-2 text-2xl font-black capitalize text-slate-900">
                    {progress.overallMasteryLevel || "low"}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Target size={22} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Mastery Score
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {Math.round((progress.overallMasteryScore || 0) * 100)}%
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={22} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Correct Answers
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {progress.correctCount || 0}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <CheckCircle2 size={22} />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Time Spent
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {progress.totalTimeSpentSeconds || 0}s
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Clock size={22} />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="text-xl font-black text-slate-900">
              Concept Mastery
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Mastery score is updated using correctness, hint usage, time
              taken, and wrong attempts.
            </p>

            <div className="mt-6 space-y-4">
              {conceptMastery.length > 0 ? (
                conceptMastery.map((item) => (
                  <div
                    key={item.concept}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-black text-slate-900">
                          {item.concept}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Correct: {item.correctCount || 0} • Wrong:{" "}
                          {item.wrongCount || 0} • Hints:{" "}
                          {item.hintUsedCount || 0}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${getMasteryColor(
                          item.masteryLevel,
                        )}`}
                      >
                        {item.masteryLevel}
                      </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{
                          width: `${Math.round(
                            (item.masteryScore || 0) * 100,
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-500">
                      {Math.round((item.masteryScore || 0) * 100)}%
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                  No concept mastery data yet. Answer at least one question.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Activity size={22} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Current Adaptive Decision
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This shows the latest support decision after a wrong, slow, or
                  stuck attempt.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-400">
                  Current Question
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                  {currentQuestion?.questionText ||
                    "No current question loaded."}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-400">
                  Latest Action
                </p>

                <p className="mt-2 text-lg font-black capitalize text-slate-900">
                  {formatAction(qLearning?.action)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-400">
                  Latest Result
                </p>

                <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                  {result?.message || "No result yet."}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase text-slate-400">
                  Q-Learning Reward
                </p>

                <p className="mt-2 text-lg font-black text-slate-900">
                  {qLearning?.reward ?? "N/A"}
                </p>
              </div>
            </div>

            {result?.isStuck && (
              <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <div className="flex items-center gap-2 text-orange-800">
                  <AlertTriangle size={20} />
                  <h3 className="font-black">Student is stuck</h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-orange-800">
                  Misconception: {result.misconceptionTag || "Not mapped"}
                </p>

                {result.misconceptionExplanation && (
                  <p className="mt-2 text-sm leading-6 text-orange-800">
                    {result.misconceptionExplanation}
                  </p>
                )}
              </div>
            )}

            {support && (
              <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-800">
                <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-wide">
                  {support.type === "hint" ? (
                    <>
                      <Lightbulb size={18} />
                      Hint
                    </>
                  ) : (
                    <>
                      <BookOpen size={18} />
                      Adaptive Support
                    </>
                  )}
                </div>

                {support.type === "tracing_steps" &&
                Array.isArray(support.steps) ? (
                  <ol className="list-decimal space-y-2 pl-5 text-sm font-semibold leading-6">
                    {support.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm font-semibold leading-6">
                    {support.text}
                  </p>
                )}
              </div>
            )}

            {qLearning?.state && (
              <div className="mt-6 rounded-2xl bg-slate-950 p-5">
                <p className="text-xs font-black uppercase text-slate-400">
                  Q-Learning State
                </p>

                <p className="mt-3 break-all font-mono text-xs font-bold leading-6 text-slate-100">
                  {qLearning.state}
                </p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default AdaptiveAssessmentPanel;
