import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/task-giving";

export default function StudentTaskGivingPage() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stuckData, setStuckData] = useState(null);

  const token = localStorage.getItem("token");

  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      const res = await axios.get(`${API_BASE}/modules`, authHeader);
      setModules(res.data.modules);
    } catch (error) {
      setMessage("Could not load modules.");
    }
  }

  async function startModule(module) {
    try {
      setLoading(true);
      setSelectedModule(module);
      setMessage("");
      setStuckData(null);

      await axios.post(
        `${API_BASE}/modules/${module._id}/start`,
        {},
        authHeader,
      );
      await loadCurrentTask(module._id);
    } catch (error) {
      setMessage("Could not start module.");
    } finally {
      setLoading(false);
    }
  }

  async function loadCurrentTask(moduleId = selectedModule?._id) {
    try {
      const res = await axios.get(
        `${API_BASE}/modules/${moduleId}/current-task`,
        authHeader,
      );

      if (res.data.completed) {
        setQuestion(null);
        setMessage(`Module completed. Score: ${res.data.score}`);
        return;
      }

      setQuestion(res.data.question);
      setSelectedAnswer("");
      setStartedAt(Date.now());
    } catch (error) {
      setMessage("Could not load current task.");
    }
  }

  async function submitAnswer() {
    if (!selectedAnswer) {
      setMessage("Please select one answer.");
      return;
    }

    try {
      setLoading(true);
      const timeTakenSeconds = Math.floor((Date.now() - startedAt) / 1000);

      const res = await axios.post(
        `${API_BASE}/submit`,
        {
          moduleId: selectedModule._id,
          questionId: question._id,
          selectedAnswer,
          timeTakenSeconds,
          hintUsed: false,
        },
        authHeader,
      );

      setMessage(res.data.message);

      if (res.data.nextAction === "NEXT_SEQUENTIAL_TASK") {
        setQuestion(res.data.nextQuestion);
        setSelectedAnswer("");
        setStartedAt(Date.now());
        setStuckData(null);
      }

      if (res.data.nextAction === "RETRY_SAME_TASK") {
        setSelectedAnswer("");
      }

      if (res.data.nextAction === "SEND_TO_DIFFICULTY_ANALYSIS") {
        setStuckData(res.data.stuckPayload);
      }

      if (res.data.nextAction === "MODULE_COMPLETED") {
        setQuestion(null);
      }
    } catch (error) {
      setMessage("Could not submit answer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold text-slate-800">
          C Programming Task Giving
        </h1>
        <p className="mt-1 text-slate-500">
          Select a module. The system gives one MCQ at a time from easy to hard.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {modules.map((module) => (
            <button
              key={module._id}
              onClick={() => startModule(module)}
              className={`rounded-xl border bg-white p-4 text-left shadow-sm hover:border-blue-500 ${
                selectedModule?._id === module._id
                  ? "border-blue-600"
                  : "border-slate-200"
              }`}
            >
              <h2 className="font-semibold text-slate-800">{module.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {module.description}
              </p>
            </button>
          ))}
        </div>

        {question && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Order: {question.orderNo} | Concept: {question.concept}
              </p>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {question.difficulty}
              </span>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              {question.questionText}
            </h2>

            {question.codeSnippet && (
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-white">
                <code>{question.codeSnippet}</code>
              </pre>
            )}

            <div className="mt-5 space-y-3">
              {question.options.map((option) => (
                <label
                  key={option.label}
                  className={`block cursor-pointer rounded-lg border p-3 ${
                    selectedAnswer === option.label
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.label}
                    checked={selectedAnswer === option.label}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    className="mr-2"
                  />
                  <strong>{option.label}.</strong> {option.text}
                </label>
              ))}
            </div>

            <button
              onClick={submitAnswer}
              disabled={loading}
              className="mt-5 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Checking..." : "Submit Answer"}
            </button>
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-lg bg-slate-100 p-4 text-slate-700">
            {message}
          </div>
        )}

        {stuckData && (
          <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 p-4">
            <h3 className="font-semibold text-orange-800">
              Stuck detected. Next: send this to Difficulty Analysis.
            </h3>
            <pre className="mt-3 overflow-x-auto text-sm text-orange-900">
              {JSON.stringify(stuckData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
