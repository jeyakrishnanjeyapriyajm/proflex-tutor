import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import {
  createLecturerQuestion,
  getLecturerContent,
  getLecturerQuestionBank,
} from "../services/lecturerService";

const emptyForm = {
  module: "",
  concept: "",
  difficulty: "easy",
  orderNo: "",
  questionText: "",
  codeSnippet: "",
  correctAnswer: "A",
  hint: "",
  detailedHint: "",
  explanation: "",
  options: [
    {
      label: "A",
      text: "",
      misconceptionTag: "",
    },
    {
      label: "B",
      text: "",
      misconceptionTag: "",
    },
    {
      label: "C",
      text: "",
      misconceptionTag: "",
    },
    {
      label: "D",
      text: "",
      misconceptionTag: "",
    },
  ],
};

const LecturerQuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [modules, setModules] = useState([]);
  const [difficulty, setDifficulty] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const loadModules = async () => {
    try {
      const data = await getLecturerContent();
      const moduleList = data.modules || [];
      setModules(moduleList);

      if (moduleList.length > 0 && !form.module) {
        setForm((prev) => ({
          ...prev,
          module: moduleList[0]._id,
        }));
      }
    } catch (error) {
      console.error("LOAD MODULES ERROR:", error);
    }
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);

      const data = await getLecturerQuestionBank({
        difficulty,
      });

      setQuestions(data.questions || []);
    } catch (error) {
      console.error("LOAD LECTURER QUESTION BANK ERROR:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to load lecturer question bank.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [difficulty]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, field, value) => {
    setForm((prev) => {
      const updatedOptions = [...prev.options];

      updatedOptions[index] = {
        ...updatedOptions[index],
        [field]: value,
      };

      return {
        ...prev,
        options: updatedOptions,
      };
    });
  };

  const validateForm = () => {
    if (!form.module) return "Please select a module.";
    if (!form.concept.trim()) return "Concept is required.";
    if (!form.orderNo) return "Order number is required.";
    if (!form.questionText.trim()) return "Question text is required.";

    const hasEmptyOption = form.options.some(
      (option) => !option.text || option.text.trim() === "",
    );

    if (hasEmptyOption) return "All four options are required.";

    if (!form.explanation.trim()) {
      return "Explanation is required to help students review answers.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });

      return;
    }

    try {
      setSaving(true);
      setMessage({
        type: "",
        text: "",
      });

      await createLecturerQuestion({
        ...form,
        orderNo: Number(form.orderNo),
        options: form.options.map((option) => ({
          ...option,
          text: option.text.trim(),
          misconceptionTag: option.misconceptionTag.trim(),
        })),
      });

      setMessage({
        type: "success",
        text: "Question added successfully.",
      });

      setForm((prev) => ({
        ...emptyForm,
        module: prev.module,
      }));

      setShowForm(false);
      await loadQuestions();
    } catch (error) {
      console.error("CREATE QUESTION ERROR:", error);

      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add question.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Question bank"
    >
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Question Bank
            </h1>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Add, review, and manage C programming MCQ questions.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="rounded-2xl border border-slate-100 bg-white px-5 py-4 text-sm font-black text-slate-700 shadow-sm outline-none"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
            >
              {showForm ? <X size={18} /> : <Plus size={18} />}
              {showForm ? "Close Form" : "Add Question"}
            </button>
          </div>
        </div>

        {message.text && (
          <div
            className={`rounded-2xl p-4 text-sm font-bold ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">
                Add New Question
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                Add MCQ questions to a selected module.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Module
                </label>

                <select
                  name="module"
                  value={form.module}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-500"
                >
                  {modules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.title || module.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Concept
                </label>

                <input
                  name="concept"
                  value={form.concept}
                  onChange={handleChange}
                  placeholder="Example: Input / Output"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Difficulty
                </label>

                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-sky-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Order Number
                </label>

                <input
                  name="orderNo"
                  value={form.orderNo}
                  onChange={handleChange}
                  placeholder="Example: 1"
                  type="number"
                  min="1"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Question Text
              </label>

              <textarea
                name="questionText"
                value={form.questionText}
                onChange={handleChange}
                placeholder="Enter the MCQ question"
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Code Snippet
              </label>

              <textarea
                name="codeSnippet"
                value={form.codeSnippet}
                onChange={handleChange}
                placeholder='Example: printf("%d", 10 / 3);'
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 font-mono text-sm font-bold text-slate-100 outline-none focus:border-sky-500"
              />
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-black text-slate-700">
                  Options
                </label>

                <select
                  name="correctAnswer"
                  value={form.correctAnswer}
                  onChange={handleChange}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none"
                >
                  <option value="A">Correct: A</option>
                  <option value="B">Correct: B</option>
                  <option value="C">Correct: C</option>
                  <option value="D">Correct: D</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {form.options.map((option, index) => (
                  <div
                    key={option.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="mb-2 text-xs font-black text-slate-500">
                      Option {option.label}
                    </p>

                    <input
                      value={option.text}
                      onChange={(event) =>
                        handleOptionChange(index, "text", event.target.value)
                      }
                      placeholder={`Enter option ${option.label}`}
                      className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                    />

                    <input
                      value={option.misconceptionTag}
                      onChange={(event) =>
                        handleOptionChange(
                          index,
                          "misconceptionTag",
                          event.target.value,
                        )
                      }
                      placeholder="Misconception tag optional"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Simple Hint
                </label>

                <textarea
                  name="hint"
                  value={form.hint}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short hint"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Detailed Hint
                </label>

                <textarea
                  name="detailedHint"
                  value={form.detailedHint}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Detailed guidance"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Explanation
                </label>

                <textarea
                  name="explanation"
                  value={form.explanation}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Answer explanation"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-600"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-sky-100 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        )}

        {loading && (
          <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-500">
            Loading questions...
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-600">
                  {question.module?.title || question.module?.name || "Module"}
                </span>

                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                  {question.concept}
                </span>

                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">
                  {question.difficulty}
                </span>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-600">
                  Order {question.orderNo}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900">
                Q{question.orderNo}. {question.questionText}
              </h2>

              {question.codeSnippet && (
                <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm font-bold text-slate-100">
                  <code>{question.codeSnippet}</code>
                </pre>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {question.options?.map((option) => (
                  <div
                    key={option.label}
                    className={`rounded-2xl border p-4 text-sm font-semibold ${
                      option.label === question.correctAnswer
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 bg-slate-50 text-slate-600"
                    }`}
                  >
                    {option.label}. {option.text}
                  </div>
                ))}
              </div>

              {question.explanation && (
                <p className="mt-4 rounded-2xl bg-sky-50 p-4 text-sm font-semibold text-sky-700">
                  Explanation: {question.explanation}
                </p>
              )}
            </div>
          ))}

          {!loading && questions.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-400">
              No questions found.
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default LecturerQuestionBank;
