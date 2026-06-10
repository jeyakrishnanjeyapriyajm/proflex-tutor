import { badges } from "../../data/studentDashboardData";

const Achievements = () => {
  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-black text-slate-900">Achievements</h3>

        <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          3 / 5 Unlocked
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.id}
              title={badge.name}
              className={`flex aspect-square items-center justify-center rounded-xl transition ${
                badge.earned
                  ? `${badge.bg} ${badge.color} shadow-sm`
                  : "bg-slate-50 text-slate-200"
              }`}
            >
              <Icon size={20} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Achievements;
