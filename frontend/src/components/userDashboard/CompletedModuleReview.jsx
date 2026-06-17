import { CheckCircle2, XCircle, Lightbulb, BookOpen } from "lucide-react";

const CompletedModuleReview = ({ reviewData }) => {
  const reviewQuestions = reviewData?.reviewQuestions || [];

  if (!reviewData || reviewQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-black text-sky-600">
            <BookOpen size={18} />
            Completed Assessment Review
          </div>

          <h3 className="text-2xl font-black text-slate-900">
            Review Your Answers
          </h3>

          <p className="mt-1 text-sm font-semibold text-slate-500">
            Correct answers and explanations are visible because the module is
            completed.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-900 px-5 py-4 text-white">
          <p className="text-xl font-black">
            {reviewData.score}/{reviewData.totalQuestions}
          </p>
          <p className="text-xs font-bold text-slate-300">
            Score • {reviewData.percentage}%
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {reviewQuestions.map((question, index) => (
          <div
            key={question.questionId}
            className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-5"
          >
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Question {index + 1} • {question.concept} •{" "}
                  {question.difficulty}
                </p>

                <h4 className="text-lg font-black leading-7 text-slate-900">
                  {question.questionText}
                </h4>
              </div>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black ${
                  question.isCorrect
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {question.isCorrect ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <XCircle size={16} />
                )}
                {question.isCorrect ? "Correct" : "Wrong"}
              </span>
            </div>

            {question.codeSnippet && (
              <pre className="mb-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-sm font-semibold text-slate-100">
                <code>{question.codeSnippet}</code>
              </pre>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Your Answer
                </p>

                <p
                  className={`mt-2 font-black ${
                    question.isCorrect ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {question.selectedAnswer || "Not answered"}{" "}
                  {question.selectedAnswerText
                    ? `- ${question.selectedAnswerText}`
                    : ""}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-xs font-black uppercase tracking-widest text-emerald-600">
                  Correct Answer
                </p>

                <p className="mt-2 font-black text-emerald-800">
                  {question.correctAnswer}{" "}
                  {question.correctAnswerText
                    ? `- ${question.correctAnswerText}`
                    : ""}
                </p>
              </div>
            </div>

            {question.explanation && (
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sky-700">
                  <Lightbulb size={18} />
                  <p className="text-sm font-black">Explanation</p>
                </div>

                <p className="text-sm font-semibold leading-7 text-sky-900">
                  {question.explanation}
                </p>
              </div>
            )}

            <div className="mt-4 grid gap-3 text-xs font-bold text-slate-500 md:grid-cols-4">
              <div>Attempts: {question.attemptCount}</div>
              <div>Time: {question.timeTakenSeconds}s</div>
              <div>Hint Used: {question.hintUsed ? "Yes" : "No"}</div>
              <div>Stuck: {question.isStuck ? "Yes" : "No"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedModuleReview;
