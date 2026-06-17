import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  Clock,
  Lightbulb,
  BookOpen,
  ChevronRight,
  Target,
  Hash,
  Trophy,
  RotateCcw,
  ArrowLeft,
  Lock,
  X,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

import Loading from "../common/Loading";
import CompletedModuleReview from "./CompletedModuleReview";
import {
  getTaskModules,
  startTaskModule,
  getCurrentTask,
  submitTaskAnswer,
  submitSuggestedRoundResult,
  getCompletedModuleReview,
} from "../../services/taskGivingService";

const RECOVERY_SUPPORT_ACTIONS = [
  "explanation",
  "easier_task",
  "similar_task",
  "harder_challenge",
];

const PRACTICE_ACTIONS = ["easier_task", "similar_task", "harder_challenge"];

const difficultyBadgeClass = (difficulty) => {
  if (difficulty === "easy") return "bg-emerald-100 text-emerald-700";
  if (difficulty === "medium") return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

const difficultyBarClass = (difficulty) => {
  if (difficulty === "easy") return "bg-emerald-500";
  if (difficulty === "medium") return "bg-amber-500";
  return "bg-rose-500";
};

const formatSeconds = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const StudentTaskGivingPanel = () => {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [task, setTask] = useState(null);
  const [progress, setProgress] = useState(null);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [stuckData, setStuckData] = useState(null);
  const [support, setSupport] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingModules, setLoadingModules] = useState(true);

  const [decisionMeta, setDecisionMeta] = useState(null);
  const [questionLocked, setQuestionLocked] = useState(false);
  const [questionLockReason, setQuestionLockReason] = useState("");
  const [recoveryPopupOpen, setRecoveryPopupOpen] = useState(false);

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [suggestedIndex, setSuggestedIndex] = useState(0);
  const [inSuggestedMode, setInSuggestedMode] = useState(false);
  const [suggestedAnswer, setSuggestedAnswer] = useState("");
  const [suggestedMessage, setSuggestedMessage] = useState("");

  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [roundResult, setRoundResult] = useState(null);
  const [completedReview, setCompletedReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const isQuestionPageOpen = Boolean(selectedModule);
  const currentSuggestedQuestion = suggestedQuestions[suggestedIndex];

  const totalQuestions =
    progress?.totalQuestions || selectedModule?.totalQuestions || 10;
  const currentQuestionNumber = Math.min(
    totalQuestions,
    (progress?.currentSequenceIndex ?? 0) + 1,
  );
  const completedCount = progress?.completedCount || 0;
  const progressPercent = totalQuestions
    ? Math.min(100, Math.round((completedCount / totalQuestions) * 100))
    : 0;

  const canAnswerCurrentQuestion = Boolean(task) && !questionLocked && !loading;

  const messageClass = useMemo(() => {
    if (messageType === "success") {
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    }

    if (messageType === "error") {
      return "border-rose-200 bg-rose-50 text-rose-800";
    }

    if (messageType === "warning") {
      return "border-orange-200 bg-orange-50 text-orange-800";
    }

    return "border-slate-100 bg-white text-slate-600";
  }, [messageType]);

  const showMessage = (text, type = "info") => {
    setMessage(text || "");
    setMessageType(type);
  };

  const resetRecoveryRound = () => {
    setSuggestedIndex(0);
    setSuggestedAnswer("");
    setSuggestedMessage("");
    setCorrectCount(0);
    setAnsweredCount(0);
    setRoundResult(null);
  };

  const resetTaskUi = () => {
    setSelectedAnswer("");
    showMessage("");
    setStuckData(null);
    setSupport(null);
    setDecisionMeta(null);
    setQuestionLocked(false);
    setQuestionLockReason("");
    setRecoveryPopupOpen(false);

    setSuggestedQuestions([]);
    setSuggestedIndex(0);
    setInSuggestedMode(false);
    setSuggestedAnswer("");
    setSuggestedMessage("");

    setCorrectCount(0);
    setAnsweredCount(0);
    setRoundResult(null);
  };

  const handleExitQuestion = () => {
    setTask(null);
    setProgress(null);
    setSelectedModule(null);
    setStartedAt(null);
    setElapsedSeconds(0);
    setCompletedReview(null);
    resetTaskUi();
  };

  const loadModules = async () => {
    try {
      setLoadingModules(true);
      showMessage("");

      const data = await getTaskModules();
      setModules(data.modules || []);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not load modules.",
        "error",
      );
    } finally {
      setLoadingModules(false);
    }
  };

  const applyLoadedTask = (data) => {
    setProgress(data.progress || null);

    if (data.completed) {
      setTask(null);
      setStartedAt(null);
      setElapsedSeconds(0);
      showMessage(
        `Module completed. Score: ${data.score || data.progress?.score || 0}`,
        "success",
      );
      return;
    }

    if (!data.question) {
      setTask(null);
      setStartedAt(null);
      setElapsedSeconds(0);
      showMessage(
        data.message ||
          "This module is waiting for recovery support. Complete the recovery practice before continuing.",
        "warning",
      );
      return;
    }

    setTask(data.question);
    setSelectedAnswer("");
    setQuestionLocked(false);
    setRecoveryPopupOpen(false);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  };

  const handleStartModule = async (module) => {
    try {
      setLoading(true);
      setSelectedModule(module);
      setTask(null);
      setProgress(null);
      resetTaskUi();

      const startData = await startTaskModule(module._id);
      setProgress(startData.progress || null);

      const data = await getCurrentTask(module._id);
      applyLoadedTask(data);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not start module.",
        "error",
      );
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
      applyLoadedTask(data);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not load task.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const getSupportTitle = (supportAction) => {
    if (supportAction === "simple_hint") return "Helpful Hint";
    if (supportAction === "explanation") return "Explanation";
    if (supportAction === "easier_task") return "Easier Recovery Practice";
    if (supportAction === "similar_task") return "Similar Recovery Practice";
    if (supportAction === "harder_challenge")
      return "Challenge Recovery Practice";
    if (supportAction === "retry_same_question") return "Try Again";
    return "Learning Support";
  };

  const getSupportText = (supportAction, responseSupport) => {
    if (!responseSupport) return "";

    if (supportAction === "simple_hint") {
      return responseSupport.hint || "Review the key idea and try again.";
    }

    if (supportAction === "explanation") {
      return (
        responseSupport.explanation ||
        responseSupport.hint ||
        "Read this explanation, then complete recovery practice. After one correct recovery answer, you will retry the same main question."
      );
    }

    if (supportAction === "easier_task") {
      return "Complete easier recovery practice first. After practice, you will retry the same main question.";
    }

    if (supportAction === "similar_task") {
      return "Complete similar recovery practice first. After practice, you will retry the same main question.";
    }

    if (supportAction === "harder_challenge") {
      return "Complete one challenge question. If correct, you can move to the next main question. If wrong, retry the same main question.";
    }

    if (supportAction === "retry_same_question") {
      return "Try the same question again carefully.";
    }

    return responseSupport.hint || responseSupport.explanation || "";
  };

  const applySupportResponse = ({ data, timeTakenSeconds }) => {
    const supportAction =
      data.decisionMaking?.recommendedSupportAction ||
      data.support?.action ||
      "simple_hint";

    const recoveryQuestions = Array.isArray(data.recoveryQuestions)
      ? data.recoveryQuestions
      : [];

    const hasRecoveryQuestions = recoveryQuestions.length > 0;
    const shouldPauseForRecovery =
      RECOVERY_SUPPORT_ACTIONS.includes(supportAction) && hasRecoveryQuestions;

    // Main question is never permanently blocked. It is only paused while
    // recovery practice is active.
    const shouldLockQuestion = shouldPauseForRecovery;
    const lockReason = shouldPauseForRecovery ? "practice_required" : "";

    setProgress(data.progress || progress);
    setSelectedAnswer("");

    setStuckData({
      questionId: task?._id,
      concept: data.difficultyAnalysis?.concept || data.support?.concept,
      difficulty:
        data.difficultyAnalysis?.effectiveDifficulty ||
        data.support?.difficulty,
      attemptNo: data.attemptNo,
      timeTakenSeconds,
      misconceptionTag: data.support?.misconceptionTag || "unknown",
      stuckReason: data.stuckAnalysis?.stuckReason || data.stuckReason,
    });

    setDecisionMeta({
      decisionLogId: data.decisionMaking?.decisionLogId,
      supportAction,
    });

    setSupport({
      type: supportAction,
      title: getSupportTitle(supportAction),
      text: getSupportText(supportAction, data.support),
      recommendedDifficulty: data.support?.recommendedDifficulty,
    });

    setSuggestedQuestions(recoveryQuestions);
    resetRecoveryRound();

    setQuestionLocked(shouldLockQuestion);
    setQuestionLockReason(lockReason);

    if (shouldPauseForRecovery) {
      setInSuggestedMode(false);
      setRecoveryPopupOpen(true);

      showMessage(
        supportAction === "explanation"
          ? "Explanation displayed. Complete recovery practice. One correct recovery answer lets you retry the same main question."
          : "Recovery practice is required. One correct recovery answer lets you retry the same main question.",
        "warning",
      );

      return;
    }

    setInSuggestedMode(false);
    setRecoveryPopupOpen(false);
    setStartedAt(Date.now());
    setElapsedSeconds(0);
    showMessage(data.message || "Use the support and try again.", "info");
  };

  const loadCompletedReview = async (moduleId) => {
    if (!moduleId) return;

    try {
      setReviewLoading(true);

      const data = await getCompletedModuleReview(moduleId);

      setCompletedReview(data);
    } catch (error) {
      console.error("LOAD COMPLETED REVIEW ERROR:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (questionLocked) {
      showMessage(
        "This question is paused. Complete the recovery practice first.",
        "warning",
      );
      return;
    }

    if (!selectedAnswer) {
      showMessage("Please select one answer.", "warning");
      return;
    }

    if (!selectedModule?._id || !task?._id) {
      showMessage("Module or task is missing.", "error");
      return;
    }

    try {
      setLoading(true);
      showMessage("");
      setStuckData(null);

      const timeTakenSeconds =
        elapsedSeconds ||
        (startedAt
          ? Math.max(1, Math.floor((Date.now() - startedAt) / 1000))
          : 0);

      const data = await submitTaskAnswer({
        moduleId: selectedModule._id,
        questionId: task._id,
        selectedAnswer,
        timeTakenSeconds,
        hintRequested: false,
      });

      setProgress(data.progress || progress);

      if (
        data.nextAction === "NEXT_SEQUENTIAL_TASK" ||
        data.nextAction === "NEXT_SEQUENTIAL_TASK_AFTER_CHALLENGE"
      ) {
        setTask(data.nextQuestion);
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
        setDecisionMeta(null);
        setSuggestedQuestions([]);
        setQuestionLocked(false);
        setRecoveryPopupOpen(false);
        showMessage(
          data.message || "Correct. Next question unlocked.",
          "success",
        );
        setStartedAt(Date.now());
        setElapsedSeconds(0);
        return;
      }

      if (data.nextAction === "RETRY_CURRENT_TASK") {
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
        setDecisionMeta(null);
        setQuestionLocked(false);
        setRecoveryPopupOpen(false);
        showMessage(data.message || "Try the same question again.", "warning");
        setStartedAt(Date.now());
        setElapsedSeconds(0);
        return;
      }

      if (
        data.nextAction === "SHOW_RECOVERY_TASKS" ||
        data.nextAction === "SHOW_Q_LEARNING_SUPPORT"
      ) {
        applySupportResponse({ data, timeTakenSeconds });
        return;
      }

      if (data.nextAction === "MODULE_COMPLETED") {
        setTask(null);
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
        setDecisionMeta(null);
        setSuggestedQuestions([]);
        setQuestionLocked(false);
        setRecoveryPopupOpen(false);

        await loadCompletedReview(selectedModule._id);

        showMessage(
          data.message || "Module completed. Review your answers below.",
          "success",
        );

        return;
      }
      if (data.nextAction === "EXIT_ASSESSMENT_REVIEW_CONCEPT") {
        setTask(null);
        setSelectedAnswer("");
        setSupport(null);
        setStuckData(null);
        setDecisionMeta(null);
        setSuggestedQuestions([]);
        setQuestionLocked(true);
        setQuestionLockReason("needs_review");
        setRecoveryPopupOpen(false);

        showMessage(
          data.message ||
            "Assessment paused. Please study this concept again before retrying.",
          "warning",
        );

        return;
      }

      showMessage(data.message || "Answer submitted.", "info");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not submit answer.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const startRecoveryPractice = () => {
    if (!suggestedQuestions.length) {
      showMessage(
        "No recovery questions are available for this concept. Please ask the lecturer to add recovery questions.",
        "warning",
      );
      return;
    }

    resetRecoveryRound();
    setRecoveryPopupOpen(false);
    setInSuggestedMode(true);
  };

  const handleSuggestedSubmit = async () => {
    if (!suggestedAnswer) {
      setSuggestedMessage("Please select an answer.");
      return;
    }

    const current = suggestedQuestions[suggestedIndex];

    if (!current) {
      setSuggestedMessage("No recovery question found.");
      return;
    }

    if (!current.correctAnswer) {
      setSuggestedMessage(
        "Recovery answer key is missing. Please check backend recovery question response.",
      );
      return;
    }

    const isCorrect = suggestedAnswer === current.correctAnswer;
    const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
    const newAnsweredCount = answeredCount + 1;

    setCorrectCount(newCorrectCount);
    setAnsweredCount(newAnsweredCount);
    setSuggestedMessage(
      isCorrect ? "Correct!" : "Incorrect. Checking next step...",
    );

    try {
      setLoading(true);

      const result = await submitSuggestedRoundResult({
        moduleId: selectedModule._id,
        correctCount: isCorrect ? 1 : 0,
        totalQuestions: suggestedQuestions.length,
        attemptedCount: newAnsweredCount,
        stuckQuestionId: stuckData?.questionId,
        decisionLogId: decisionMeta?.decisionLogId,
        supportAction: decisionMeta?.supportAction,
      });

      setProgress(result.progress || progress);

      if (result.nextAction === "CONTINUE_RECOVERY_TASKS") {
        const nextIndex = suggestedIndex + 1;

        if (nextIndex < suggestedQuestions.length) {
          setSuggestedIndex(nextIndex);
          setSuggestedAnswer("");
          setSuggestedMessage(
            result.message || "Try the next recovery question.",
          );
        }

        return;
      }

      if (
        result.nextAction === "RETRY_MAIN_QUESTION_AFTER_RECOVERY" ||
        result.nextAction === "RETRY_MAIN_QUESTION_AFTER_REVIEW"
      ) {
        setRoundResult(isCorrect ? "pass" : null);
        setSuggestedMessage(
          result.message ||
            "Recovery completed. Try the same main question again.",
        );

        const nextTask = result.nextQuestion || task;

        resetTaskUi();
        setTask(nextTask);
        setProgress(result.progress || progress);
        setQuestionLocked(false);
        setQuestionLockReason("");
        setStartedAt(Date.now());
        setElapsedSeconds(0);

        showMessage(
          result.message || "Now try the same main question again.",
          isCorrect ? "success" : "warning",
        );

        return;
      }

      if (result.nextAction === "NEXT_SEQUENTIAL_TASK_AFTER_CHALLENGE") {
        resetTaskUi();
        setTask(result.nextQuestion);
        setProgress(result.progress || progress);
        setStartedAt(Date.now());
        setElapsedSeconds(0);
        showMessage(
          result.message || "Challenge correct. Next main question unlocked.",
          "success",
        );
        return;
      }

      if (result.nextAction === "MODULE_COMPLETED") {
        resetTaskUi();
        setTask(null);
        setProgress(result.progress || progress);

        await loadCompletedReview(selectedModule._id);

        showMessage(
          result.message || "Module completed. Review your answers below.",
          "success",
        );

        return;
      }

      if (
        result.nextAction === "WAIT_REVIEW_TIME" ||
        result.nextAction === "EXIT_ASSESSMENT_REVIEW_CONCEPT" ||
        result.nextAction === "NEEDS_MORE_SUPPORT"
      ) {
        setRoundResult("fail");
        setInSuggestedMode(false);
        setQuestionLocked(true);
        setQuestionLockReason("needs_review");
        setRecoveryPopupOpen(false);
        setSuggestedQuestions([]);

        setSuggestedMessage(
          result.message ||
            "Recovery not completed. Please study this concept before retrying.",
        );

        showMessage(
          result.message ||
            "Assessment paused. Please study this concept before retrying.",
          "warning",
        );

        return;
      }

      setSuggestedMessage(result.message || "Recovery result processed.");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Could not process recovery result.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    if (!task || !startedAt || inSuggestedMode) return undefined;

    const updateElapsed = () => {
      setElapsedSeconds(
        Math.max(1, Math.floor((Date.now() - startedAt) / 1000)),
      );
    };

    updateElapsed();
    const timerId = window.setInterval(updateElapsed, 1000);

    return () => window.clearInterval(timerId);
  }, [task, startedAt, inSuggestedMode]);

  return (
    <div className="flex-1 bg-slate-50/70 font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
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
                  Choose one C programming module. The system gives main
                  questions in order and opens recovery practice only when the
                  backend recommends support.
                </p>
              </div>

              <span className="hidden rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-400 shadow-sm md:inline-flex">
                {modules.length} modules
              </span>
            </div>

            {message && (
              <div
                className={`mb-6 rounded-[2rem] border p-5 text-sm font-bold shadow-sm ${messageClass}`}
              >
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
                            {module.totalQuestions || 10} Questions
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

        {isQuestionPageOpen && (
          <section className="space-y-8">
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
                    Main question count follows the backend sequence. Recovery
                    practice has its own count.
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

            {message && !inSuggestedMode && (
              <div
                className={`rounded-[2rem] border p-5 text-sm font-bold shadow-sm ${messageClass}`}
              >
                {message}
              </div>
            )}

            {loading && !task && !inSuggestedMode && (
              <Loading text="Opening selected module..." />
            )}

            {task && !inSuggestedMode && (
              <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
                <div id="task-giving-question-screen">
                  <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Main Question
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-slate-900">
                        {currentQuestionNumber} of {totalQuestions}
                      </h3>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Timer
                      </p>
                      <h3 className="mt-1 flex items-center gap-2 text-2xl font-black text-slate-900">
                        <Clock size={22} />
                        {formatSeconds(elapsedSeconds)}
                      </h3>
                    </div>

                    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Status
                      </p>
                      <h3 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
                        {questionLocked ? (
                          <>
                            <Lock size={20} className="text-orange-600" />{" "}
                            Locked
                          </>
                        ) : (
                          <>
                            <Target size={20} className="text-sky-600" /> Active
                          </>
                        )}
                      </h3>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/30 md:p-10">
                    <div
                      className={`absolute left-0 right-0 top-0 h-1.5 ${difficultyBarClass(task.difficulty)}`}
                    />

                    {questionLocked && (
                      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
                        <Lock size={20} className="mt-0.5 shrink-0" />
                        <p className="text-sm font-bold leading-6">
                          {questionLockReason === "explanation_blocked"
                            ? "This main question is paused while recovery practice is active. One correct recovery answer lets you retry it."
                            : "This main question is paused until you complete recovery practice. After practice, you can retry the same main question."}
                        </p>
                      </div>
                    )}

                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${difficultyBadgeClass(task.difficulty)}`}
                          >
                            {task.difficulty} task
                          </span>

                          <span className="rounded-lg border border-slate-200/60 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                            {task.concept}
                          </span>
                        </div>

                        <h2 className="mt-3 text-2xl font-black text-slate-900">
                          {selectedModule?.title || selectedModule?.name}{" "}
                          Practice
                        </h2>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm font-black text-slate-500">
                        Q {currentQuestionNumber}/{totalQuestions}
                      </div>
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
                          className={`flex items-start gap-4 rounded-2xl border-2 p-5 text-left font-bold transition-all ${
                            questionLocked
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400 opacity-70"
                              : selectedAnswer === option.label
                                ? "cursor-pointer border-sky-600 bg-sky-50 text-sky-600 shadow-md shadow-sky-50"
                                : "cursor-pointer border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="answer"
                            value={option.label}
                            checked={selectedAnswer === option.label}
                            onChange={(event) =>
                              setSelectedAnswer(event.target.value)
                            }
                            disabled={questionLocked}
                            className="sr-only"
                          />

                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                              selectedAnswer === option.label && !questionLocked
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
                          {formatSeconds(elapsedSeconds)}
                        </span>

                        <span className="flex items-center gap-1">
                          <Target size={14} />
                          Adaptive Support
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={!canAnswerCurrentQuestion || !selectedAnswer}
                        className={`flex w-full items-center justify-center gap-2 rounded-2xl px-10 py-5 font-black text-white shadow-md transition-all sm:w-auto ${
                          canAnswerCurrentQuestion && selectedAnswer
                            ? "bg-sky-600 shadow-sky-100 hover:bg-sky-700"
                            : "bg-slate-300"
                        } disabled:cursor-not-allowed disabled:opacity-70`}
                      >
                        {loading
                          ? "Checking..."
                          : questionLocked
                            ? "Question Locked"
                            : "Submit Answer"}
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <aside className="space-y-6">
                  <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Difficulty Path
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      {["easy", "medium", "hard"].map((level, index) => (
                        <div key={level} className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
                              task.difficulty === level
                                ? difficultyBadgeClass(level)
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {level}
                          </span>
                          {index < 2 && (
                            <span className="text-slate-300">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {support ? (
                    <div
                      className={`rounded-[2rem] border p-6 shadow-sm ${support.type === "explanation" ? "border-purple-200 bg-purple-50 text-purple-900" : "border-sky-100 bg-sky-50 text-sky-800"}`}
                    >
                      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                        {support.type === "simple_hint" ? (
                          <Lightbulb size={20} />
                        ) : (
                          <BookOpen size={20} />
                        )}
                        {support.title}
                      </div>

                      <p className="whitespace-pre-wrap text-sm font-semibold leading-7">
                        {support.text || "Use this support and try again."}
                      </p>

                      {questionLocked && suggestedQuestions.length > 0 && (
                        <button
                          type="button"
                          onClick={startRecoveryPractice}
                          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700"
                        >
                          <PlayCircle size={18} />
                          Start Recovery Practice
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                      <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400">
                        <Lightbulb size={20} />
                        Hint / Explanation
                      </div>

                      <p className="text-sm font-semibold leading-7 text-slate-500">
                        Hints, explanations, and error details will appear here
                        after the backend detects stuck status.
                      </p>
                    </div>
                  )}

                  {stuckData && (
                    <div className="rounded-[2rem] border border-orange-200 bg-orange-50 p-6 shadow-sm shadow-orange-100">
                      <div className="mb-5 flex items-center gap-3 text-orange-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                          <AlertTriangle size={24} />
                        </div>

                        <div>
                          <h3 className="text-lg font-black">
                            Error / Stuck Details
                          </h3>
                          <p className="text-xs font-semibold text-orange-700">
                            This is from the backend stuck-analysis response.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-2xl bg-white/70 p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                            Concept
                          </p>
                          <p className="font-black text-orange-900">
                            {stuckData.concept || "-"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl bg-white/70 p-4">
                            <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                              Attempt
                            </p>
                            <p className="font-black text-orange-900">
                              {stuckData.attemptNo || 1}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-white/70 p-4">
                            <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                              Time
                            </p>
                            <p className="font-black text-orange-900">
                              {stuckData.timeTakenSeconds || 0}s
                            </p>
                          </div>
                        </div>

                        <div className="rounded-2xl bg-white/70 p-4">
                          <p className="text-xs font-black uppercase tracking-widest text-orange-500">
                            Reason
                          </p>
                          <p className="font-black text-orange-900">
                            {stuckData.stuckReason || "wrong answer"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </aside>
              </div>
            )}

            {roundResult === "pass" && (
              <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
                <Trophy className="mx-auto mb-3 text-emerald-600" size={36} />
                <p className="text-sm font-black text-emerald-800">
                  Recovery completed. You got {correctCount}/
                  {suggestedQuestions.length} correct.
                </p>
              </div>
            )}

            {roundResult === "fail" && (
              <div className="rounded-[2.5rem] border border-orange-200 bg-orange-50 p-8 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-orange-800">
                  <AlertTriangle size={22} />
                  <h3 className="font-black">More Practice Needed</h3>
                </div>

                <p className="text-sm font-semibold leading-7 text-orange-800">
                  You got {correctCount}/{suggestedQuestions.length} correct.
                  Please study this concept again before retrying the
                  assessment.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExitQuestion}
                    className="rounded-2xl bg-orange-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-100 transition-all hover:bg-orange-700"
                  >
                    Back to Modules
                  </button>
                </div>
              </div>
            )}

            {inSuggestedMode && currentSuggestedQuestion && !roundResult && (
              <div className="mx-auto max-w-5xl">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-200 bg-white p-6 shadow-xl shadow-purple-100/40 md:p-12">
                  <div className="absolute left-0 right-0 top-0 h-1.5 bg-purple-500" />

                  <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-purple-700">
                          Recovery Practice
                        </span>

                        <span className="rounded-lg border border-slate-200/60 bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                          {suggestedIndex + 1} of {suggestedQuestions.length}
                        </span>
                      </div>

                      <h2 className="mt-2 text-2xl font-black text-slate-900">
                        {currentSuggestedQuestion.concept}
                      </h2>
                    </div>

                    <div className="text-left md:text-right">
                      <span
                        className={`rounded-full px-4 py-2 text-xs font-black uppercase ${difficultyBadgeClass(currentSuggestedQuestion.difficulty)}`}
                      >
                        {currentSuggestedQuestion.difficulty}
                      </span>

                      <p className="mt-2 text-xs font-black uppercase tracking-widest text-slate-400">
                        Score: {correctCount}/{answeredCount} correct
                      </p>
                    </div>
                  </div>

                  <p className="mb-8 whitespace-pre-wrap text-xl font-black leading-relaxed text-slate-800">
                    {currentSuggestedQuestion.questionText}
                  </p>

                  {currentSuggestedQuestion.codeSnippet && (
                    <pre className="mb-8 overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-emerald-400 shadow-inner">
                      <code>{currentSuggestedQuestion.codeSnippet}</code>
                    </pre>
                  )}

                  <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {currentSuggestedQuestion.options?.map((option) => (
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
                          onChange={(event) =>
                            setSuggestedAnswer(event.target.value)
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
                    ))}
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
                        setInSuggestedMode(false);
                        setRecoveryPopupOpen(true);
                      }}
                      className="w-full rounded-2xl border border-slate-200 px-6 py-4 text-sm font-black text-slate-500 transition-all hover:bg-slate-50 sm:w-auto"
                    >
                      Back to Support
                    </button>

                    <button
                      type="button"
                      onClick={handleSuggestedSubmit}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-10 py-5 font-black text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700 disabled:opacity-60 sm:w-auto"
                    >
                      {loading ? "Checking..." : "Submit Recovery Answer"}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {recoveryPopupOpen &&
              !inSuggestedMode &&
              suggestedQuestions.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
                  <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-purple-100 bg-white p-8 shadow-2xl">
                    <button
                      type="button"
                      onClick={() => setRecoveryPopupOpen(false)}
                      className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                    >
                      <X size={18} />
                    </button>

                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-100 text-purple-700">
                      <PlayCircle size={34} />
                    </div>

                    <h3 className="text-2xl font-black text-slate-900">
                      Recovery Practice Required
                    </h3>

                    <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
                      {questionLockReason === "explanation_blocked"
                        ? "The current main question is paused while recovery practice is active. Complete one recovery question correctly to retry the same main question."
                        : "Complete recovery practice first. After practice, you will retry the same main question."}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Practice Count
                        </p>
                        <p className="text-xl font-black text-slate-900">
                          {suggestedQuestions.length}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Concept
                        </p>
                        <p className="truncate text-xl font-black text-slate-900">
                          {stuckData?.concept || task?.concept || "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={startRecoveryPractice}
                      className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 px-6 py-5 text-sm font-black text-white shadow-lg shadow-purple-100 transition-all hover:bg-purple-700"
                    >
                      <CheckCircle2 size={20} />
                      {questionLockReason === "explanation_blocked"
                        ? "Start Recovery Practice"
                        : "Start Practice Before Retry"}
                    </button>
                  </div>
                </div>
              )}
            {reviewLoading && (
              <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-500 shadow-sm">
                Loading completed review...
              </div>
            )}

            {completedReview && (
              <CompletedModuleReview reviewData={completedReview} />
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentTaskGivingPanel;
