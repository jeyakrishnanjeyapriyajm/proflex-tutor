import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import { getLecturerContent } from "../services/lecturerService";

const LecturerContent = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getLecturerContent();
        setModules(data.modules || []);
      } catch (error) {
        console.error("LOAD LECTURER CONTENT ERROR:", error);
      }
    };

    loadContent();
  }, []);

  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Curriculum and modules"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-black text-slate-900">
          Curriculum Content
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module._id}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                Module {module.orderNo || "-"}
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                {module.title || module.name}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {module.description || "C programming learning module."}
              </p>

              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                  {module.questionCount || 0} questions
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    module.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {module.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default LecturerContent;
