import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentCurriculum } from "../services/studentService";

const StudentCurriculum = () => {
  const [curriculum, setCurriculum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCurriculum = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentCurriculum();
      setCurriculum(data.curriculum);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchCurriculum}>
        <Card className="p-8">
          <h1 className="text-2xl font-black text-slate-900">
            {curriculum?.course}
          </h1>

          <p className="mt-2 text-slate-500">
            Modules, learning outcomes and progress tracking.
          </p>
        </Card>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {curriculum?.modules?.map((module) => (
            <Card key={module.moduleNo} className="p-6">
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                Module {module.moduleNo}
              </span>

              <h2 className="mt-4 text-xl font-black text-slate-900">
                {module.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.outcome}
              </p>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-600"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentCurriculum;
