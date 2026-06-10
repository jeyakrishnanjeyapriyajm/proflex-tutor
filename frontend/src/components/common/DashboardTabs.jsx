import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const DashboardTabs = ({
  tabs,
  title = "Dashboard",
  subtitle = "Workspace",
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="sticky top-28 rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-5 border-b border-slate-100 px-2 pb-5">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.path;

            return (
              <button
                key={tab.path}
                onClick={() => handleNavigate(tab.path)}
                className={`group flex min-w-fit items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left transition lg:w-full ${
                  isActive
                    ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                    : "bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white text-sky-600"
                    }`}
                  >
                    {Icon && <Icon size={19} />}
                  </div>

                  <div>
                    <p className="text-sm font-black">{tab.label}</p>

                    {tab.description && (
                      <p
                        className={`mt-0.5 hidden text-xs font-medium lg:block ${
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
                  className={`hidden transition lg:block ${
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
