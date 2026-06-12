import { FileText, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const resourceIcons = {
  PDF: FileText,
  Video: Video,
};

const resourceStyles = {
  PDF: "bg-indigo-50 text-indigo-600",
  Video: "bg-rose-50 text-rose-600",
};

const LatestResources = ({ items = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 text-left shadow-sm">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Latest Resources</h3>

        <button
          onClick={() => navigate("/student/resources")}
          className="text-xs font-bold text-sky-600 hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {items.map((res, index) => {
          const Icon = resourceIcons[res.type] || FileText;
          const style =
            resourceStyles[res.type] || "bg-slate-50 text-slate-600";

          return (
            <div
              key={res.title || index}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-slate-50"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${style}`}
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

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-5 text-center">
            <p className="text-xs font-medium text-slate-400">
              No resources available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestResources;
