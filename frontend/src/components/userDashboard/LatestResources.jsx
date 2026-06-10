import { resources } from "../../data/studentDashboardData";

const LatestResources = () => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-black text-slate-900">Latest Resources</h3>
        <button className="text-xs font-bold text-sky-600 hover:underline">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((res) => {
          const Icon = res.icon;

          return (
            <div
              key={res.title}
              className="flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition hover:bg-slate-50"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${res.bg} ${res.color}`}
              >
                <Icon size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">
                  {res.title}
                </p>
                <p className="mt-0.5 text-[10px] font-bold text-slate-400">
                  {res.type} • {res.size}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LatestResources;
