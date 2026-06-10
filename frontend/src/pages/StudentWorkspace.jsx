import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentWorkspace } from "../services/studentService";

const StudentWorkspace = () => {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentWorkspace();
      setWorkspace(data.workspace);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchWorkspace}>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-8 lg:col-span-2">
            <h1 className="text-2xl font-black text-slate-900">
              {workspace?.currentTask?.title}
            </h1>

            <p className="mt-2 text-slate-500">
              {workspace?.currentTask?.instruction}
            </p>

            <pre className="mt-6 overflow-x-auto rounded-2xl bg-slate-950 p-6 text-sm text-slate-100">
              {workspace?.currentTask?.starterCode}
            </pre>
          </Card>

          <Card className="p-8">
            <h2 className="text-xl font-black text-slate-900">Hints</h2>

            <div className="mt-5 space-y-3">
              {workspace?.hints?.map((hint, index) => (
                <div key={index} className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-sm font-bold text-sky-700">{hint}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentWorkspace;
