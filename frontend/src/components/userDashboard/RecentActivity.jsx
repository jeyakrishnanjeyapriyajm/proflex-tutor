import { BookOpen, Clock, Code2, Trophy } from "lucide-react";

const activityIcons = {
  exercise: Code2,
  quiz: BookOpen,
  badge: Trophy,
};

const activityStyles = {
  exercise: "bg-emerald-50 text-emerald-600",
  quiz: "bg-sky-50 text-sky-600",
  badge: "bg-amber-50 text-amber-600",
};

const RecentActivity = ({ items = [] }) => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm">
      <h3 className="mb-8 flex items-center gap-2 text-xl font-bold text-slate-900">
        <Clock size={22} className="text-sky-600" />
        Recent Activity
      </h3>

      <div className="space-y-6">
        {items.map((activity, index) => {
          const Icon = activityIcons[activity.type] || Code2;
          const iconStyle =
            activityStyles[activity.type] || activityStyles.exercise;

          return (
            <div
              key={activity.title || index}
              className="group flex items-center gap-5 rounded-2xl border border-transparent p-4 text-left transition-colors hover:border-slate-100 hover:bg-slate-50"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${iconStyle}`}
              >
                <Icon size={24} />
              </div>

              <div className="flex-1">
                <p className="font-bold text-slate-900">{activity.title}</p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {activity.time}
                </p>
              </div>

              <span
                className={`rounded-xl px-3 py-1.5 text-xs font-black ${
                  activity.result === "Passed" || activity.result === "Unlocked"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-sky-50 text-sky-600"
                }`}
              >
                {activity.result}
              </span>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center">
            <p className="text-sm font-medium text-slate-400">
              No recent activity yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentActivity;
