import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentResources } from "../services/studentService";

const StudentResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentResources();
      setResources(data.resources || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchResources}>
        <Card className="p-8">
          <h1 className="text-2xl font-black text-slate-900">
            Learning Resources
          </h1>
          <p className="mt-2 text-slate-500">
            Lecture notes, PDFs, videos and reference materials.
          </p>
        </Card>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {resources.map((resource) => (
            <Card key={resource.title} className="p-6">
              <h2 className="text-lg font-black text-slate-900">
                {resource.title}
              </h2>

              <p className="mt-2 text-sm font-bold text-slate-500">
                {resource.type} • {resource.size}
              </p>
            </Card>
          ))}
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentResources;
