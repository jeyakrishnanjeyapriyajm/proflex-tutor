import { Clock } from "lucide-react";
import { recentActivities } from "../../data/studentDashboardData";

const RecentActivity = () => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <h3 className="mb-8 flex items-center gap-2 text-xl font-black text-slate-900">
        <Clock size={22} className="text-sky-600" />
        Recent Activity
      </h3>

      <div className="space-y-5">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.title}
              className="flex items-center gap-5 rounded-2xl border border-transparent p-4 transition hover:border-slate-100 hover:bg-slate-50"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.bg} ${activity.color}`}
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
      </div>
    </section>
  );
};

export default RecentActivity;
