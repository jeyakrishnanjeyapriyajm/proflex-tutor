// Keep your same imports/actions from current file.
// Main change: UI only.

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Hash,
  Lightbulb,
  Loader2,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import {
  fetchTaskModules,
  startModule,
  fetchCurrentTask,
  submitAnswer,
  clearTaskResult,
  setSelectedModule,
} from "../../features/taskGiving/taskGivingSlice";

const StudentTaskGivingPanel = () => {
  const dispatch = useDispatch();
  const startedAtRef = useRef(null);

  const {
    modules,
    selectedModule,
    progress,
    currentQuestion,
    result,
    support,
    qLearning,
    completed,
    loading,
    submitting,
    error,
  } = useSelector((state) => state.taskGiving);

  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [hintUsed, setHintUsed] = useState(false);
  const [detailedHintUsed, setDetailedHintUsed] = useState(false);

  useEffect(() => {
    dispatch(fetchTaskModules());
  }, [dispatch]);

  useEffect(() => {
    if (currentQuestion?._id) {
      startedAtRef.current = Date.now();
    }
  }, [currentQuestion?._id]);

  const resetLocalTaskUi = () => {
    setSelectedAnswer("");
    setLocalMessage("");
    setHintUsed(false);
    setDetailedHintUsed(false);
    dispatch(clearTaskResult());
  };

  const handleOpenModule = (module) => {
    dispatch(setSelectedModule(module));
    resetLocalTaskUi();
    setShowExplanation(true);
  };

  const handleStartModule = async () => {
    if (!selectedModule?._id) return;

    resetLocalTaskUi();

    const response = await dispatch(startModule(selectedModule._id));

    if (startModule.fulfilled.match(response)) {
      setShowExplanation(false);
      startedAtRef.current = Date.now();
    }
  };

  const handleLoadCurrentTask = async () => {
    if (!selectedModule?._id) return;

    resetLocalTaskUi();

    const response = await dispatch(fetchCurrentTask(selectedModule._id));

    if (fetchCurrentTask.fulfilled.match(response)) {
      setShowExplanation(false);
      startedAtRef.current = Date.now();
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      setLocalMessage("Please select one answer.");
      return;
    }

    if (!selectedModule?._id || !currentQuestion?._id) {
      setLocalMessage("Module or question is missing.");
      return;
    }

    const timeTakenSeconds = startedAtRef.current
      ? Math.max(1, Math.floor((Date.now() - startedAtRef.current) / 1000))
      : 0;

    setLocalMessage("");

    const response = await dispatch(
      submitAnswer({
        moduleId: selectedModule._id,
        questionId: currentQuestion._id,
        selectedAnswer,
        timeTakenSeconds,
        hintUsed,
        detailedHintUsed,
        skipped: false,
      }),
    );

    if (submitAnswer.fulfilled.match(response)) {
      setSelectedAnswer("");
      startedAtRef.current = Date.now();
    }
  };

  const handleSkipQuestion = async () => {
    if (!selectedModule?._id || !currentQuestion?._id) return;

    const timeTakenSeconds = startedAtRef.current
      ? Math.max(1, Math.floor((Date.now() - startedAtRef.current) / 1000))
      : 0;

    await dispatch(
      submitAnswer({
        moduleId: selectedModule._id,
        questionId: currentQuestion._id,
        selectedAnswer: "SKIPPED",
        timeTakenSeconds,
        hintUsed,
        detailedHintUsed,
        skipped: true,
      }),
    );

    setSelectedAnswer("");
  };

  const buildExplanation = (module) => ({
    title: module?.title || module?.name || "C Programming Module",
    description:
      module?.description ||
      "Read this module explanation before starting the MCQ sequence.",
    concepts:
      module?.concepts?.length > 0
        ? module.concepts
        : ["Syntax", "Logic", "Tracing", "Common Mistakes"],
  });

  const explanation = buildExplanation(selectedModule);

  if (loading && !currentQuestion && !modules?.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-sky-600"
            size={44}
          />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Loading adaptive assessment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      {!selectedModule && !currentQuestion && (
        <>
          <header>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                Adaptive Diagnostic System
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
                Q-Learning Ready
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Personalized Concept Diagnostics
            </h1>

            <p className="mt-3 max-w-3xl text-lg leading-relaxed text-slate-500">
              Select a C programming module. The system gives MCQs from easy to
              hard and provides adaptive support when the student gets stuck.
            </p>
          </header>

          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {modules?.map((module, index) => (
              <button
                key={module._id}
                onClick={() => handleOpenModule(module)}
                className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm transition-all hover:border-sky-100 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-slate-50 transition-all group-hover:scale-150 group-hover:bg-sky-50/50" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200 transition-transform group-hover:scale-110">
                    <Hash size={24} />
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-600">
                    Module {module.orderNo || index + 1}
                  </p>

                  <h3 className="mt-2 truncate text-xl font-bold text-slate-900">
                    {module.title || module.name}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                      Easy → Medium → Hard
                    </span>

                    <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-500">
                      {module.totalQuestions || 10} Questions
                    </span>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-sky-600 transition-transform group-hover:translate-x-1">
                    Open Assessment
                    <ChevronRight size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {showExplanation && selectedModule && (
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => {
              dispatch(setSelectedModule(null));
              setShowExplanation(false);
              resetLocalTaskUi();
            }}
            className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-sky-600"
          >
            <ArrowLeft size={18} />
            Back to Modules
          </button>

          <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/40 md:p-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-sky-100 bg-sky-50 text-sky-600">
                <BookOpen size={32} />
              </div>

              <div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                  Learning Explanation
                </span>

                <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                  {explanation.title}
                </h2>
              </div>
            </div>

            <p className="mb-8 text-lg leading-relaxed text-slate-600">
              {explanation.description}
            </p>

            <div className="mb-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                <h3 className="mb-4 font-bold text-slate-900">Main Concepts</h3>

                <div className="space-y-3">
                  {explanation.concepts.map((concept) => (
                    <div
                      key={concept}
                      className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600"
                    >
                      {concept}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-amber-800">
                  <Sparkles size={18} />
                  Before You Start
                </h3>

                <ul className="space-y-3 text-sm leading-6 text-amber-800">
                  <li>Read the concept carefully.</li>
                  <li>Answer each MCQ one by one.</li>
                  <li>Use support when you are stuck.</li>
                  <li>
                    The system records attempts, time, hints, and mastery.
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleStartModule}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-sm font-black text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 disabled:opacity-60"
            >
              <PlayCircle size={18} />
              {loading ? "Starting..." : "Start MCQ Task"}
            </button>
          </div>
        </div>
      )}

      {currentQuestion && !showExplanation && (
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <button
                onClick={() => {
                  dispatch(setSelectedModule(null));
                  resetLocalTaskUi();
                }}
                className="mt-1 rounded-2xl border border-slate-200 bg-white p-3 text-slate-400 hover:text-slate-600"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                      currentQuestion.difficulty?.toLowerCase() === "easy"
                        ? "bg-emerald-100 text-emerald-700"
                        : currentQuestion.difficulty?.toLowerCase() === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {currentQuestion.difficulty} Stream
                  </span>

                  <span className="rounded-lg border border-slate-200/50 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                    {currentQuestion.concept}
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                  {selectedModule?.title || selectedModule?.name} Diagnostic
                  Test
                </h2>
              </div>
            </div>

            {progress && (
              <div className="rounded-2xl border border-slate-200/60 bg-white px-4 py-2.5">
                <p className="text-[9px] font-black uppercase text-slate-400">
                  Progress
                </p>
                <p className="font-mono text-xs font-black text-slate-600">
                  {progress.completedCount || 0}/{progress.totalQuestions || 10}{" "}
                  • {progress.percentage || 0}%
                </p>
              </div>
            )}
          </header>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/30 md:p-12">
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-sky-600" />

            <div className="mb-8 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Question #{currentQuestion.orderNo}
              </span>

              <button
                onClick={() => {
                  setHintUsed(true);
                  setDetailedHintUsed(true);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-600"
              >
                <Lightbulb size={16} />
                Request Hint
              </button>
            </div>

            <p className="mb-8 whitespace-pre-wrap text-xl font-bold leading-relaxed text-slate-800">
              {currentQuestion.questionText}
            </p>

            {currentQuestion.codeSnippet && (
              <pre className="mb-8 overflow-x-auto rounded-3xl bg-slate-950 p-6 text-sm text-emerald-400">
                <code>{currentQuestion.codeSnippet}</code>
              </pre>
            )}

            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedAnswer(option.label)}
                  className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                    selectedAnswer === option.label
                      ? "border-sky-600 bg-sky-50 text-sky-600 shadow-md shadow-sky-50"
                      : "border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                      selectedAnswer === option.label
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {option.label}
                  </span>

                  <span className="pt-1 text-sm font-medium leading-relaxed">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-5 border-t border-slate-100 pt-8 sm:flex-row">
              <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Timer Active
                </span>
                <span className="flex items-center gap-1">
                  <Target size={14} />
                  Adaptive Attempt
                </span>
                <span className="flex items-center gap-1">
                  <Trophy size={14} />
                  Mastery Tracking
                </span>
              </div>

              <div className="flex w-full gap-3 sm:w-auto">
                <button
                  onClick={handleSkipQuestion}
                  disabled={submitting}
                  className="rounded-2xl border border-slate-200 px-5 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50"
                >
                  Skip
                </button>

                <button
                  disabled={!selectedAnswer || submitting}
                  onClick={handleSubmitAnswer}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white sm:flex-none ${
                    selectedAnswer
                      ? "bg-sky-600 hover:bg-sky-700"
                      : "cursor-not-allowed bg-slate-300"
                  }`}
                >
                  {submitting ? "Checking..." : "Submit Answer"}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {support && (
        <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-6 text-sm font-semibold text-amber-800">
          <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-wide">
            <Lightbulb size={18} />
            Adaptive Support
          </div>
          <p className="leading-6">{support.text}</p>
        </div>
      )}

      {(localMessage || result?.message) && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm font-semibold text-slate-700 shadow-sm">
          {localMessage || result?.message}
        </div>
      )}

      {result?.isStuck && (
        <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-6">
          <div className="mb-3 flex items-center gap-2 text-orange-800">
            <AlertTriangle size={20} />
            <h3 className="font-black">Stuck detected</h3>
          </div>

          <p className="text-sm leading-6 text-orange-800">
            The system selected adaptive support using attempts, time,
            difficulty, mastery level, and misconception pattern.
          </p>

          <p className="mt-4 text-sm font-black text-orange-900">
            Q-Learning Action:{" "}
            {qLearning?.action?.replaceAll("_", " ") || "support"}
          </p>
        </div>
      )}

      {completed && (
        <div className="rounded-[2.5rem] border border-emerald-100 bg-emerald-50 p-10 text-center">
          <CheckCircle2 size={44} className="mx-auto text-emerald-600" />

          <h2 className="mt-4 text-3xl font-black text-emerald-900">
            Module Completed
          </h2>

          <p className="mt-2 text-sm font-semibold text-emerald-700">
            Score: {progress?.score || 0} / {progress?.totalQuestions || 10}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentTaskGivingPanel;
