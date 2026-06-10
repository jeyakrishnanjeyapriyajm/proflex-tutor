import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentAnalytics } from "../services/studentService";

const StudentAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchAnalytics}>
        <div className="space-y-6">
          <Card className="p-8">
            <h1 className="text-2xl font-black text-slate-900">
              Learning Analytics
            </h1>
            <p className="mt-2 text-slate-500">
              Predictive score, module completion, mastery trends and weak
              areas.
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-8">
              <p className="text-sm font-bold text-slate-500">
                Predictive Score
              </p>
              <h2 className="mt-4 text-5xl font-black text-sky-600">
                {analytics?.predictiveScore}
              </h2>
            </Card>

            <Card className="p-8 lg:col-span-2">
              <h2 className="mb-5 text-xl font-black text-slate-900">
                Weak Areas
              </h2>

              <div className="space-y-3">
                {analytics?.weakAreas?.map((item) => (
                  <div
                    key={item.concept}
                    className="rounded-2xl bg-slate-50 p-4"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">
                        {item.concept}
                      </span>
                      <span className="font-black text-red-500">
                        {item.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-8">
            <h2 className="mb-5 text-xl font-black text-slate-900">
              Module Completion
            </h2>

            <div className="space-y-4">
              {analytics?.moduleCompletion?.map((module) => (
                <div key={module.module}>
                  <div className="mb-2 flex justify-between text-sm font-bold">
                    <span>{module.module}</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-600"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentAnalytics;
