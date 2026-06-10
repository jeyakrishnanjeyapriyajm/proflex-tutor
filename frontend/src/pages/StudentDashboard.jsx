import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import UserOverview from "../components/userDashboard/UserOverview";
import Loading from "../components/common/Loading";
import Card from "../components/common/Card";
import { studentTabs } from "../data/portalTabs";
import { getStudentDashboard } from "../services/studentService";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentDashboard();
      setDashboardData(data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load student dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      {loading && <Loading text="Loading student dashboard..." />}

      {!loading && error && (
        <Card className="p-8">
          <h2 className="text-xl font-black text-red-600">
            Dashboard loading failed
          </h2>
          <p className="mt-2 text-slate-500">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-5 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white"
          >
            Try Again
          </button>
        </Card>
      )}

      {!loading && !error && dashboardData && (
        <UserOverview data={dashboardData} />
      )}
    </PortalLayout>
  );
};

export default StudentDashboard;
