import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import { getLecturerAnalytics } from "../services/lecturerService";

const LecturerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getLecturerAnalytics();
      setAnalytics(data.analytics || null);
    } catch (error) {
      console.error("LOAD LECTURER ANALYTICS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Learning analytics"
    >
      <div className="space-y-8">
        <h1 className="text-3xl font-black text-slate-900">
          Lecturer Analytics
        </h1>

        {loading && (
          <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-500">
            Loading analytics...
          </div>
        )}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-slate-900">
              Module Analytics
            </h2>

            <div className="space-y-4">
              {analytics?.moduleAnalytics?.map((item) => (
                <div
                  key={item.moduleId}
                  className="rounded-2xl bg-slate-50 p-5"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-black text-slate-900">
                      {item.moduleName}
                    </p>
                    <span className="font-black text-sky-600">
                      {item.accuracy}%
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-500">
                    Attempts: {item.totalAttempts} • Stuck: {item.stuckEvents}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-slate-900">
              Concept Mastery
            </h2>

            <div className="space-y-4">
              {analytics?.conceptMastery?.map((item) => (
                <div key={item.concept} className="rounded-2xl bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-black text-slate-900">{item.concept}</p>
                    <span className="font-black text-emerald-600">
                      {item.averageMasteryPercentage}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min(
                          100,
                          item.averageMasteryPercentage || 0,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PortalLayout>
  );
};

export default LecturerAnalytics;
