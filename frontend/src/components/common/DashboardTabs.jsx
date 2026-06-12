import { useLocation, useNavigate } from "react-router-dom";
import { BrainCircuit, ChevronRight } from "lucide-react";

const DashboardTabs = ({
  tabs = [],
  title = "ProgFlex",
  subtitle = "AI Coding Tutor",
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="hidden min-h-screen w-80 shrink-0 border-r border-slate-100 bg-white p-6 lg:block">
      <div className="sticky top-6">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-xs font-semibold text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              location.pathname === tab.path ||
              location.pathname.startsWith(`${tab.path}/`);

            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={`group flex w-full items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                    : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-50 text-sky-600 group-hover:bg-white"
                    }`}
                  >
                    {Icon && <Icon size={19} />}
                  </div>

                  <div>
                    <p className="text-sm font-black">{tab.label}</p>

                    {tab.description && (
                      <p
                        className={`mt-0.5 text-xs font-medium ${
                          isActive ? "text-sky-50" : "text-slate-400"
                        }`}
                      >
                        {tab.description}
                      </p>
                    )}
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className={`transition ${
                    isActive
                      ? "text-white"
                      : "text-slate-300 group-hover:text-sky-500"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default DashboardTabs;
