import { BrainCircuit, Clock, Trophy, TrendingUp } from "lucide-react";

const ProgressSummary = ({ dashboard }) => {
  const progress = dashboard?.overallProgress || 0;

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="relative z-10">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <TrendingUp size={22} className="text-sky-600" />
            Overall Progress
          </h3>

          <span className="rounded-xl bg-sky-50 px-4 py-1.5 text-sm font-bold text-sky-600">
            {dashboard?.course || "C Programming"}
          </span>
        </div>

        <div className="mb-8">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Course Completion
            </span>
            <span className="text-2xl font-black text-slate-900">
              {progress}%
            </span>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-2xl font-black text-slate-900">
              {dashboard?.completedModules || 0}/{dashboard?.totalModules || 0}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Modules
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-2xl font-black text-slate-900">
              {dashboard?.completedMCQs || 0}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              MCQs Completed
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
            <p className="text-2xl font-black text-slate-900">
              {dashboard?.timeSpentHours || 0}h
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Time Spent
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">
                {dashboard?.totalXP || 0} XP
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Total Points
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-lg font-black text-slate-900">
                {dashboard?.activeStreak || 0} Days
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Active Streak
              </p>
            </div>
          </div>
        </div>
      </div>

      <BrainCircuit className="absolute -bottom-10 -right-10 h-64 w-64 text-slate-50" />
    </section>
  );
};

export default ProgressSummary;
