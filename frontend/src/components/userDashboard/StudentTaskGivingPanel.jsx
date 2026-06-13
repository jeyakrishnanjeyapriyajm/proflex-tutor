import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Lightbulb,
  BookOpen,
  Sparkles,
} from "lucide-react";

import Card from "../common/Card";
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

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <Card className="p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-sky-700">
              <ClipboardCheck size={14} />
              Task Giving
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              C Programming MCQ Task Giving
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select a module. The system gives one MCQ at a time from easy to
              hard. If the first answer is wrong, the system shows a hint. If
              the second answer is wrong, it shows an explanation. After the
              third wrong attempt, the student is sent to Difficulty Analysis.
              If easy practice is recommended, the student answers 5 questions
              and needs 3 correct to continue.
            </p>
          </div>

          {selectedModule && (
            <button
              onClick={handleLoadCurrentTask}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Reload Current Task
            </button>
          )}
        </div>
      </Card>

      {/* ── Module grid ── */}
      {loadingModules ? (
        <Loading text="Loading modules..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <button
              key={module._id}
              onClick={() => handleStartModule(module)}
              className={`rounded-[1.5rem] border bg-white p-5 text-left shadow-sm transition hover:border-sky-300 hover:shadow-md ${
                selectedModule?._id === module._id
                  ? "border-sky-500 ring-4 ring-sky-50"
                  : "border-slate-100"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-wide text-sky-600">
                Module {module.orderNo}
              </p>
              <h2 className="mt-2 text-lg font-black text-slate-900">
                {module.name}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.description}
              </p>
              <p className="mt-4 text-xs font-bold text-slate-400">
                {module.totalQuestions} questions
              </p>
            </button>
          ))}
        </div>
      )}

      {/* ── Main task card (hidden during suggested mode) ── */}
      {task && !inSuggestedMode && (
        <Card className="p-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                Question {task.orderNo} • {task.concept}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-900">
                {task.questionText}
              </h2>
            </div>
            <span className="w-fit rounded-full bg-sky-50 px-4 py-2 text-xs font-black uppercase text-sky-700">
              {task.difficulty}
            </span>
          </div>

          {task.codeSnippet && (
            <pre className="mb-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">
              <code>{task.codeSnippet}</code>
            </pre>
          )}

          <div className="space-y-3">
            {task.options?.map((option) => (
              <label
                key={option.label}
                className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                  selectedAnswer === option.label
                    ? "border-sky-500 bg-sky-50 ring-4 ring-sky-50"
                    : "border-slate-100 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.label}
                  checked={selectedAnswer === option.label}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="mt-1"
                />
                <span className="text-sm leading-6 text-slate-700">
                  <strong>{option.label}.</strong> {option.text}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSubmitAnswer}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-60"
            >
              <CheckCircle2 size={18} />
              {loading ? "Checking..." : "Submit Answer"}
            </button>
          </div>
        </Card>
      )}

      {/* ── Hint / Explanation ── */}
      {support && !inSuggestedMode && (
        <div
          className={`rounded-2xl border p-5 text-sm font-semibold ${
            support.type === "hint"
              ? "border-amber-100 bg-amber-50 text-amber-800"
              : "border-blue-100 bg-blue-50 text-blue-800"
          }`}
        >
          <div className="mb-2 flex items-center gap-2 font-black uppercase tracking-wide">
            {support.type === "hint" ? (
              <>
                <Lightbulb size={18} /> Hint
              </>
            ) : (
              <>
                <BookOpen size={18} /> Explanation
              </>
            )}
          </div>
          <p className="leading-6">{support.text}</p>
        </div>
      )}

      {/* ── General message ── */}
      {message && !inSuggestedMode && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm font-semibold text-slate-700 shadow-sm">
          {message}
        </div>
      )}

      {/* ── Stuck detected banner ── */}
      {stuckData && !inSuggestedMode && (
        <div className="rounded-[1.5rem] border border-orange-200 bg-orange-50 p-6">
          <div className="mb-3 flex items-center gap-2 text-orange-800">
            <AlertTriangle size={20} />
            <h3 className="font-black">Stuck detected</h3>
          </div>
          <p className="text-sm leading-6 text-orange-800">
            The student answered incorrectly three times. Sending to BKT + RL
            Difficulty Analysis model and Q-learning Decision Making model.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-xs font-bold uppercase text-orange-500">
                Concept
              </p>
              <p className="font-black text-orange-900">{stuckData.concept}</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-xs font-bold uppercase text-orange-500">
                Difficulty
              </p>
              <p className="font-black text-orange-900">
                {stuckData.difficulty}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-xs font-bold uppercase text-orange-500">
                Attempt
              </p>
              <p className="font-black text-orange-900">
                {stuckData.attemptNo}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4">
              <p className="text-xs font-bold uppercase text-orange-500">
                Time Taken
              </p>
              <p className="font-black text-orange-900">
                <Clock size={16} className="mr-1 inline" />
                {stuckData.timeTakenSeconds}s
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 md:col-span-2">
              <p className="text-xs font-bold uppercase text-orange-500">
                Misconception Tag
              </p>
              <p className="font-black text-orange-900">
                {stuckData.misconceptionTag || "Not mapped"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Loading analysis spinner ── */}
      {loadingAnalysis && (
        <div className="rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center">
          <p className="text-sm font-bold text-purple-700">
            🤖 Analysing your learning pattern… Fetching suggested questions.
          </p>
        </div>
      )}

      {/* ── AI Recommendation banner (shown above suggested question) ── */}
      {inSuggestedMode && analysisResult && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            <span className="text-sm font-black uppercase tracking-wide text-purple-700">
              AI Recommendation
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xs font-bold uppercase text-purple-500">
                Mastery Level
              </p>
              <p className="font-black capitalize text-purple-900">
                {analysisResult.mastery_level}
              </p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xs font-bold uppercase text-purple-500">
                Recommended Difficulty
              </p>
              <p className="font-black capitalize text-purple-900">
                {analysisResult.recommended_next_difficulty}
              </p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className="text-xs font-bold uppercase text-purple-500">
                Support Action
              </p>
              <p className="font-black capitalize text-purple-900">
                {analysisResult.recommended_support_action?.replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-purple-700">
            Answer {suggestedQuestions.length} practice questions below. You
            need {PASS_THRESHOLD} correct to continue your module.
          </p>
        </div>
      )}

      {/* ── Pass / Fail round result banners ── */}
      {roundResult === "pass" && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
          <p className="text-sm font-black text-teal-800">
            🎉 You got {correctCount}/{suggestedQuestions.length} correct.
            Returning to your question...
          </p>
        </div>
      )}

      {roundResult === "fail" && (
        <div className="rounded-[1.5rem] border border-orange-200 bg-orange-50 p-6">
          <div className="mb-2 flex items-center gap-2 text-orange-800">
            <AlertTriangle size={20} />
            <h3 className="font-black">Mastery Level: Low</h3>
          </div>
          <p className="text-sm leading-6 text-orange-800">
            You got {correctCount}/{suggestedQuestions.length} correct.
            Restarting this module from Question 1 to rebuild your foundation...
          </p>
        </div>
      )}

      {/* ── Suggested questions card ── */}
      {inSuggestedMode && suggestedQuestions.length > 0 && !roundResult && (
        <Card className="border-2 border-purple-200 p-8">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-purple-500">
                Suggested Practice &bull; {suggestedIndex + 1} of{" "}
                {suggestedQuestions.length} &bull;{" "}
                {suggestedQuestions[suggestedIndex].concept}
              </p>
              <h2 className="mt-2 text-xl font-black text-slate-900">
                {suggestedQuestions[suggestedIndex].questionText}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="w-fit rounded-full bg-purple-50 px-4 py-2 text-xs font-black uppercase text-purple-700">
                {suggestedQuestions[suggestedIndex].difficulty}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Score: {correctCount}/{answeredCount} correct so far
              </span>
            </div>
          </div>

          {suggestedQuestions[suggestedIndex].codeSnippet && (
            <pre className="mb-6 overflow-x-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">
              <code>{suggestedQuestions[suggestedIndex].codeSnippet}</code>
            </pre>
          )}

          <div className="space-y-3">
            {suggestedQuestions[suggestedIndex].options?.map((option) => (
              <label
                key={option.label}
                className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                  suggestedAnswer === option.label
                    ? "border-purple-500 bg-purple-50 ring-4 ring-purple-50"
                    : "border-slate-100 bg-white hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="suggested-answer"
                  value={option.label}
                  checked={suggestedAnswer === option.label}
                  onChange={(e) => setSuggestedAnswer(e.target.value)}
                  className="mt-1"
                />
                <span className="text-sm leading-6 text-slate-700">
                  <strong>{option.label}.</strong> {option.text}
                </span>
              </label>
            ))}
          </div>

          {suggestedMessage && (
            <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
              {suggestedMessage}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleSuggestedSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              <CheckCircle2 size={18} />
              {loading ? "Checking..." : "Submit Answer"}
            </button>

            <button
              onClick={() => {
                resetTaskUi();
                handleLoadCurrentTask();
              }}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Skip &amp; Return to Module
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentTaskGivingPanel;
