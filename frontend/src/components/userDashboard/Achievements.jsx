import { Award, Code2, Flame, Sparkles, Trophy } from "lucide-react";

const badgeIcons = [Trophy, Flame, Code2, Sparkles, Award];

const Achievements = ({ items = [] }) => {
  const earnedCount = items.filter((badge) => badge.earned).length;

  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Achievements</h3>

        <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {earnedCount} / {items.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {items.map((badge, index) => {
          const Icon = badgeIcons[index % badgeIcons.length];

          return (
            <div
              key={badge.id || index}
              title={badge.name}
              className={`flex aspect-square items-center justify-center rounded-xl transition-all ${
                badge.earned
                  ? "bg-amber-50 text-amber-600 shadow-sm"
                  : "bg-slate-50 text-slate-200"
              }`}
            >
              <Icon size={20} />
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-4 rounded-2xl border border-dashed border-slate-200 p-5 text-center">
            <p className="text-xs font-medium text-slate-400">
              No achievements yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
