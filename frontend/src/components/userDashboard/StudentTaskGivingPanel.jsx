import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Lightbulb,
  BookOpen,
  Sparkles,
  ChevronRight,
  Target,
  Hash,
  Trophy,
  RotateCcw,
  ArrowLeft,
} from "lucide-react";

import Loading from "../common/Loading";

import {
  getTaskModules,
  startTaskModule,
  getCurrentTask,
  submitTaskAnswer,
  runDifficultyAnalysis,
  submitSuggestedRoundResult,
} from "../../services/taskGivingService";

const PASS_THRESHOLD = 3; // need 3 out of 5 correct

const StudentTaskGivingPanel = () => {
  // ── existing state ───────────────────────────────────────────────────────
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [task, setTask] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [message, setMessage] = useState("");
  const [stuckData, setStuckData] = useState(null);
  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingModules, setLoadingModules] = useState(true);

  const handleExitQuestion = () => {
    setTask(null);
    setSelectedModule(null);
    resetTaskUi();
  };

  // ── suggested questions state ────────────────────────────────────────────
  const [analysisResult, setAnalysisResult] = useState(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedIndex, setSuggestedIndex] = useState(0);
  const [inSuggestedMode, setInSuggestedMode] = useState(false);
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [suggestedMessage, setSuggestedMessage] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // ── NEW: scoring + round result state ────────────────────────────────────
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [roundResult, setRoundResult] = useState(null); // null | "pass" | "fail"

  // ── helpers ──────────────────────────────────────────────────────────────
  const loadModules = async () => {
    try {
      setLoadingModules(true);
      setMessage("");
      const data = await getTaskModules();
      setModules(data.modules || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load modules.");
    } finally {
      setLoadingModules(false);
    }
  };

  const resetTaskUi = () => {
    setSelectedAnswer("");
    setStuckData(null);
    setSupport(null);
    setMessage("");
    // suggested mode resets
    setAnalysisResult(null);
    setSuggestedQuestions([]);
    setSuggestedIndex(0);
    setInSuggestedMode(false);
    setSuggestedAnswer("");
    setSuggestedMessage("");
    // round result resets
    setCorrectCount(0);
    setAnsweredCount(0);
    setRoundResult(null);
  };

  const handleStartModule = async (module) => {
    try {
      setLoading(true);
      setSelectedModule(module);
      setTask(null);
      resetTaskUi();

      await startTaskModule(module._id);
      const data = await getCurrentTask(module._id);

      if (data.completed) {
        setTask(null);
        setMessage(`Module completed. Score: ${data.score}`);
      } else {
        setTask(data.question);
        setStartedAt(Date.now());
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not start module.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCurrentTask = async () => {
    if (!selectedModule?._id) return;
    try {
      setLoading(true);
      resetTaskUi();
      const data = await getCurrentTask(selectedModule._id);

      if (data.completed) {
        setTask(null);
        setMessage(`Module completed. Score: ${data.score}`);
      } else {
        setTask(data.question);
        setStartedAt(Date.now());
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load task.");
    } finally {
      setLoading(false);
    }
  };

  // ── submit main module answer ─────────────────────────────────────────────
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer) {
      setMessage("Please select one answer.");
      return;
    }
    if (!selectedModule?._id || !task?._id) {
      setMessage("Module or task is missing.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setStuckData(null);

      const timeTakenSeconds = Math.floor((Date.now() - startedAt) / 1000);

      const data = await submitTaskAnswer({
        moduleId: selectedModule._id,
        questionId: task._id,
        selectedAnswer,
        timeTakenSeconds,
      });

      setMessage(data.message);

      if (data.nextAction === "NEXT_SEQUENTIAL_TASK") {
        setTask(data.nextQuestion);
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
        setStartedAt(Date.now());
      }

      if (data.nextAction === "SHOW_HINT") {
        setSelectedAnswer("");
        setSupport(data.support || null);
        setStuckData(null);
      }

      if (data.nextAction === "SHOW_EXPLANATION") {
        setSelectedAnswer("");
        setSupport(data.support || null);
        setStuckData(null);
      }

      if (data.nextAction === "MODULE_COMPLETED") {
        setTask(null);
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
      }

      // ── 3 wrong attempts → call Python model ─────────────────────────────
      if (data.nextAction === "SEND_TO_DIFFICULTY_ANALYSIS") {
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(data.stuckPayload);

        setLoadingAnalysis(true);
        try {
          const analysis = await runDifficultyAnalysis({
            questionId: data.stuckPayload.questionId,
            concept: data.stuckPayload.concept,
            difficulty: data.stuckPayload.difficulty,
            selectedAnswer: data.stuckPayload.selectedAnswer,
            correctAnswer: data.stuckPayload.correctAnswer,
            attemptNo: data.stuckPayload.attemptNo,
            timeTakenSeconds: data.stuckPayload.timeTakenSeconds,
            hintUsed: data.stuckPayload.hintUsed,
            misconceptionTag: data.stuckPayload.misconceptionTag,
          });

          setAnalysisResult(analysis);
          setSuggestedQuestions(analysis.suggestedQuestions || []);
          setSuggestedIndex(0);
          setCorrectCount(0);
          setAnsweredCount(0);
          setRoundResult(null);
          setInSuggestedMode(true);
          setSuggestedMessage("");
        } catch {
          setMessage("Model analysis failed. Please try again.");
        } finally {
          setLoadingAnalysis(false);
        }
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit answer.");
    } finally {
      setLoading(false);
    }
  };

  // ── submit suggested question answer ─────────────────────────────────────
  const handleSuggestedSubmit = async () => {
    if (!suggestedAnswer) {
      setSuggestedMessage("Please select an answer.");
      return;
    }

    const current = suggestedQuestions[suggestedIndex];
    const isCorrect = suggestedAnswer === current.correctAnswer;

    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newAnsweredCount = answeredCount + 1;

    setCorrectCount(newCorrectCount);
    setAnsweredCount(newAnsweredCount);
    setSuggestedMessage(isCorrect ? "✅ Correct!" : "❌ Incorrect.");

    const isLastQuestion = suggestedIndex === suggestedQuestions.length - 1;

    if (!isLastQuestion) {
      // Move to next question after short delay
      setTimeout(() => {
        setSuggestedIndex((i) => i + 1);
        setSuggestedAnswer("");
        setSuggestedMessage("");
      }, 1000);
      return;
    }

    // ── All 5 questions answered — decide pass/fail ─────────────────────────
    setTimeout(async () => {
      try {
        setLoading(true);

        const result = await submitSuggestedRoundResult({
          moduleId: selectedModule._id,
          correctCount: newCorrectCount,
          totalQuestions: suggestedQuestions.length,
          stuckQuestionId: stuckData?.questionId,
        });

        if (result.nextAction === "CONTINUE_STUCK_QUESTION") {
          setRoundResult("pass");
          setSuggestedMessage(result.message);

          setTimeout(() => {
            resetTaskUi();
            handleLoadCurrentTask();
          }, 2000);
        }

        if (result.nextAction === "RESTART_MODULE") {
          setRoundResult("fail");
          setSuggestedMessage(result.message);

          setTimeout(() => {
            resetTaskUi();
            handleStartModule(selectedModule);
          }, 2500);
        }
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Could not process result.",
        );
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    loadModules();
  }, []);

  const isQuestionPageOpen = !!selectedModule;

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 bg-slate-50/50 font-sans">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Module Selection Page */}
        {!isQuestionPageOpen && (
          <section>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                  <ClipboardCheck size={14} />
                  Task Giving
                </div>

                <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                  Select Learning Module
                </h2>

                <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-500">
                  Choose one C programming concept. The question will open in a
                  clean workspace page with adaptive support.
                </p>
              </div>

              <span className="hidden rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 shadow-sm md:inline-flex">
                {modules.length} modules
              </span>
            </div>

            {message && (
              <div className="mb-6 rounded-[2rem] border border-slate-100 bg-white p-5 text-sm font-bold text-slate-600 shadow-sm">
                {message}
              </div>
            )}

            {loadingModules ? (
              <Loading text="Loading modules..." />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {modules.map((module, index) => {
                  const colorClasses = [
                    "bg-blue-500",
                    "bg-sky-500",
                    "bg-emerald-500",
                    "bg-purple-500",
                    "bg-amber-500",
                    "bg-orange-500",
                    "bg-red-500",
                    "bg-rose-500",
                    "bg-indigo-500",
                  ];

                  const moduleColor = colorClasses[index % colorClasses.length];

                  return (
                    <button
                      key={module._id}
                      type="button"
                      onClick={() => handleStartModule(module)}
                      className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-sky-100 hover:shadow-xl hover:shadow-slate-200/50"
                    >
                      <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-slate-50 transition-all group-hover:scale-150 group-hover:bg-sky-50/60" />

                      <div className="relative z-10">
                        <div
                          className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-slate-200 transition-transform group-hover:scale-110 ${moduleColor}`}
                        >
                          <Hash size={24} />
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                          Module {module.orderNo || index + 1}
                        </p>

                        <h3 className="mt-2 truncate text-xl font-black text-slate-900">
                          {module.title || module.name}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-slate-500">
                          {module.description ||
                            "C programming practice module."}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                          <span className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            {module.totalQuestions || 0} Questions
                          </span>

                          <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            Easy → Hard
                          </span>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-sm font-black text-sky-600 transition-transform group-hover:translate-x-1">
                          Open Task Workspace <ChevronRight size={16} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Question Workspace Page */}
        {isQuestionPageOpen && (
          <section className="space-y-8">
            {/* Workspace Header */}
            <div className="flex flex-col gap-5 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={handleExitQuestion}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                  title="Back to modules"
                >
                  <ArrowLeft size={22} />
                </button>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600">
                      Active Task
                    </span>

                    <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {selectedModule?.title ||
                        selectedModule?.name ||
                        "Selected Module"}
                    </span>
                  </div>

                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    Question Workspace
                  </h2>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Complete the current task. Use the back arrow to return to
                    module selection.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleLoadCurrentTask}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:bg-slate-50"
                >
                  <RotateCcw size={17} />
                  Reload
                </button>

                <button
                  type="button"
                  onClick={handleExitQuestion}
                  className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800"
                >
                  Exit Task
                </button>
              </div>
            </div>

            {loading && !task && !inSuggestedMode && (
              <Loading text="Opening selected module..." />
            )}

            {/* Main Task Question */}
            {task && !inSuggestedMode && (
              <div
                className="mx-auto max-w-5xl"
                id="task-giving-question-screen"
              >
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
                      <BookOpen size={22} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${
                            task.difficulty === "easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : task.difficulty === "medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {task.difficulty} Mastery Stream
                        </span>

                        <span className="rounded-lg border border-slate-200/60 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                          One MCQ at a time
                        </span>
                      </div>

                      <h2 className="mt-2 text-2xl font-black text-slate-900">
                        {selectedModule?.title || selectedModule?.name}{" "}
                        Diagnostic Task
                      </h2>
                    </div>
                  </div>

                  <div className="w-full text-left md:w-auto md:text-right">
                    <span className="block text-xs font-black uppercase tracking-widest text-slate-400">
                      Session Progress Matrix
                    </span>

                    <div className="mt-1.5 flex max-w-sm items-center gap-3 rounded-2xl border border-slate-200/60 bg-white px-4 py-2.5">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400">
                          Interactive HUD
                        </span>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`text-xs font-black uppercase ${
                              task.difficulty === "easy"
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            Easy
                          </span>
                          <span className="text-xs text-slate-300">→</span>
                          <span
                            className={`text-xs font-black uppercase ${
                              task.difficulty === "medium"
                                ? "text-amber-600"
                                : "text-slate-400"
                            }`}
                          >
                            Med
                          </span>
                          <span className="text-xs text-slate-300">→</span>
                          <span
                            className={`text-xs font-black uppercase ${
                              task.difficulty === "hard"
                                ? "text-rose-600"
                                : "text-slate-400"
                            }`}
                          >
                            Hard
                          </span>
                        </div>
                      </div>

                      <div className="h-8 w-px bg-slate-200" />

                      <div className="text-left font-mono">
                        <p className="text-[10px] font-black text-slate-600">
                          Q#{task.orderNo || 1}
                        </p>

                        <div className="mt-1 flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <span
                              key={dot}
                              className={`h-2.5 w-2.5 rounded-full border ${
                                dot === 1
                                  ? "border-amber-400 bg-amber-400"
                                  : "border-slate-200 bg-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/30 md:p-12">
                  <div
                    className={`absolute left-0 right-0 top-0 h-1.5 ${
                      task.difficulty === "easy"
                        ? "bg-emerald-500"
                        : task.difficulty === "medium"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                  />

                  <div className="mb-10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Question #{task.orderNo || 1} • {task.concept}
                    </span>

                    <span className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
                      {task.difficulty}
                    </span>
                  </div>

                  <p className="mb-8 whitespace-pre-wrap text-xl font-black leading-relaxed text-slate-800">
                    {task.questionText}
                  </p>

                  {task.codeSnippet && (
                    <pre className="mb-8 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-emerald-400 shadow-inner">
                      <code>{task.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {task.options?.map((option) => (
                      <label
                        key={option.label}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 text-left font-bold transition-all ${
                          selectedAnswer === option.label
                            ? "border-sky-600 bg-sky-50 text-sky-600 shadow-md shadow-sky-50"
                            : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option.label}
                          checked={selectedAnswer === option.label}
                          onChange={(e) => setSelectedAnswer(e.target.value)}
                          className="sr-only"
                        />

                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
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
                      </label>
                    ))}
                  </div>

                  <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-slate-100 pt-8 sm:flex-row">
                    <div className="flex w-full flex-wrap gap-4 text-xs font-black uppercase tracking-widest text-slate-400 sm:w-auto">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {startedAt
                          ? Math.max(
                              1,
                              Math.round((Date.now() - startedAt) / 1000),
                            )
                          : 0}
                        s
                      </span>

                      <span className="flex items-center gap-1">
                        <Target size={14} />
                        Adaptive Flow
                      </span>

                      <span className="flex items-center gap-1">
                        <Trophy size={14} />
                        Hint → Explanation → Analysis
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={loading}
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-10 py-5 font-black text-white shadow-md transition-all sm:w-auto ${
                        selectedAnswer
                          ? "bg-sky-600 shadow-sky-100 hover:bg-sky-700"
                          : "bg-slate-300"
                      } disabled:opacity-60`}
                    >
                      {loading ? "Checking..." : "Submit Answer"}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hint / Explanation */}
            {support && !inSuggestedMode && (
              <div
                className={`rounded-[2rem] border p-6 shadow-sm ${
                  support.type === "hint"
                    ? "border-amber-100 bg-amber-50 text-amber-800"
                    : "border-sky-100 bg-sky-50 text-sky-800"
                }`}
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                  {support.type === "hint" ? (
                    <>
                      <Lightbulb size={20} />
                      Remediation Hint
                    </>
                  ) : (
                    <>
                      <BookOpen size={20} />
                      Detailed Explanation
                    </>
                  )}
                </div>

                <p className="text-sm font-semibold leading-7">
                  {support.text}
                </p>
              </div>
            )}

            {/* General Message */}
            {message && !inSuggestedMode && (
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-sm font-bold text-slate-600 shadow-sm">
                {message}
              </div>
            )}

            {/* Stuck Detected */}
            {stuckData && !inSuggestedMode && (
              <div className="rounded-[2.5rem] border border-orange-200 bg-orange-50 p-8 shadow-sm shadow-orange-100">
                <div className="mb-5 flex items-center gap-3 text-orange-800">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                    <AlertTriangle size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black">Stuck Detected</h3>
                    <p className="text-sm font-semibold text-orange-700">
                      Sending performance data to Difficulty Analysis.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Concept
                    </p>
                    <p className="font-black text-orange-900">
                      {stuckData.concept}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Difficulty
                    </p>
                    <p className="font-black text-orange-900">
                      {stuckData.difficulty}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Attempt
                    </p>
                    <p className="font-black text-orange-900">
                      {stuckData.attemptNo}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Time Taken
                    </p>
                    <p className="font-black text-orange-900">
                      <Clock size={16} className="mr-1 inline" />
                      {stuckData.timeTakenSeconds}s
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4 md:col-span-2">
                    <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                      Misconception Tag
                    </p>
                    <p className="font-black text-orange-900">
                      {stuckData.misconceptionTag || "Not mapped"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading Analysis */}
            {loadingAnalysis && (
              <div className="rounded-[2rem] border border-purple-100 bg-purple-50 p-8 text-center shadow-sm">
                <Sparkles className="mx-auto mb-3 text-purple-600" size={30} />
                <p className="text-sm font-black uppercase tracking-widest text-purple-700">
                  Analysing learning pattern...
                </p>
                <p className="mt-2 text-sm font-medium text-purple-600">
                  Fetching suggested questions from the adaptive difficulty
                  model.
                </p>
              </div>
            )}

            {/* AI Recommendation */}
            {inSuggestedMode && analysisResult && (
              <div className="rounded-[2.5rem] border border-purple-200 bg-purple-50 p-8 shadow-sm shadow-purple-100">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-purple-600">
                    <Sparkles size={24} />
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">
                      AI Recommendation
                    </span>
                    <h3 className="text-xl font-black text-purple-950">
                      Personalized Practice Round
                    </h3>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-purple-500">
                      Mastery Level
                    </p>
                    <p className="font-black capitalize text-purple-900">
                      {analysisResult.mastery_level}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-purple-500">
                      Recommended Difficulty
                    </p>
                    <p className="font-black capitalize text-purple-900">
                      {analysisResult.recommended_next_difficulty}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/70 p-4">
                    <p className="text-xs font-black uppercase tracking-widest text-purple-500">
                      Support Action
                    </p>
                    <p className="font-black capitalize text-purple-900">
                      {analysisResult.recommended_support_action?.replace(
                        /_/g,
                        " ",
                      )}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm font-semibold leading-7 text-purple-700">
                  Answer {suggestedQuestions.length} practice questions. You
                  need {PASS_THRESHOLD} correct answers to continue your module.
                </p>
              </div>
            )}

            {/* Pass Result */}
            {roundResult === "pass" && (
              <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
                <Trophy className="mx-auto mb-3 text-emerald-600" size={36} />
                <p className="text-sm font-black text-emerald-800">
                  You got {correctCount}/{suggestedQuestions.length} correct.
                  Returning to your question...
                </p>
              </div>
            )}

            {/* Fail Result */}
            {roundResult === "fail" && (
              <div className="rounded-[2.5rem] border border-orange-200 bg-orange-50 p-8 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-orange-800">
                  <AlertTriangle size={22} />
                  <h3 className="font-black">Mastery Level: Low</h3>
                </div>

                <p className="text-sm font-semibold leading-7 text-orange-800">
                  You got {correctCount}/{suggestedQuestions.length} correct.
                  Restarting this module from Question 1 to rebuild your
                  foundation.
                </p>
              </div>
            )}

            {/* Suggested Question Card */}
            {inSuggestedMode &&
              suggestedQuestions.length > 0 &&
              !roundResult && (
                <div className="mx-auto max-w-5xl">
                  <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-200 bg-white p-6 shadow-xl shadow-purple-100/40 md:p-12">
                    <div className="absolute left-0 right-0 top-0 h-1.5 bg-purple-500" />

                    <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">
                            Suggested Practice
                          </span>

                          <span className="rounded-lg border border-slate-200/60 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                            {suggestedIndex + 1} of {suggestedQuestions.length}
                          </span>
                        </div>

                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                          {suggestedQuestions[suggestedIndex].concept}
                        </h2>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase text-purple-700">
                          {suggestedQuestions[suggestedIndex].difficulty}
                        </span>

                        <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-400">
                          Score: {correctCount}/{answeredCount} correct
                        </p>
                      </div>
                    </div>

                    <p className="mb-8 whitespace-pre-wrap text-xl font-black leading-relaxed text-slate-800">
                      {suggestedQuestions[suggestedIndex].questionText}
                    </p>

                    {suggestedQuestions[suggestedIndex].codeSnippet && (
                      <pre className="mb-8 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-emerald-400 shadow-inner">
                        <code>
                          {suggestedQuestions[suggestedIndex].codeSnippet}
                        </code>
                      </pre>
                    )}

                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {suggestedQuestions[suggestedIndex].options?.map(
                        (option) => (
                          <label
                            key={option.label}
                            className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 p-5 text-left font-bold transition-all ${
                              suggestedAnswer === option.label
                                ? "border-purple-600 bg-purple-50 text-purple-600 shadow-md shadow-purple-50"
                                : "border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="suggested-answer"
                              value={option.label}
                              checked={suggestedAnswer === option.label}
                              onChange={(e) =>
                                setSuggestedAnswer(e.target.value)
                              }
                              className="sr-only"
                            />

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                suggestedAnswer === option.label
                                  ? "bg-purple-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {option.label}
                            </span>

                            <span className="pt-1 text-sm font-medium leading-relaxed">
                              {option.text}
                            </span>
                          </label>
                        ),
                      )}
                    </div>

                    {suggestedMessage && (
                      <div className="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm font-black text-slate-700">
                        {suggestedMessage}
                      </div>
                    )}

                    <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          resetTaskUi();
                          handleLoadCurrentTask();
                        }}
                        className="w-full rounded-2xl border border-slate-200 px-6 py-4 text-sm font-black text-slate-500 transition-all hover:bg-slate-50 sm:w-auto"
                      >
                        Skip & Return to Module
                      </button>

                      <button
                        type="button"
                        onClick={handleSuggestedSubmit}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-10 py-5 font-black text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700 disabled:opacity-60 sm:w-auto"
                      >
                        {loading ? "Checking..." : "Submit Answer"}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentTaskGivingPanel;
