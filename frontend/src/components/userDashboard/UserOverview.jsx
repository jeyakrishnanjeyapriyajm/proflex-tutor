import { useEffect, useState } from "react";

import ProgressSummary from "./ProgressSummary";
import ConceptMastery from "./ConceptMastery";
import RecentActivity from "./RecentActivity";
import ResumeLearningCard from "./ResumeLearningCard";
import LatestResources from "./LatestResources";
import RecentMessages from "./RecentMessages";
import Achievements from "./Achievements";

import { getStudentDashboardSummary } from "../../services/studentDashboardService";

const UserOverview = ({ data }) => {
  const [dashboard, setDashboard] = useState(data?.dashboard || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDashboardSummary = async () => {
      try {
        setLoading(true);

        const response = await getStudentDashboardSummary();

        setDashboard(response.dashboard || null);
      } catch (error) {
        console.error("LOAD STUDENT DASHBOARD SUMMARY ERROR:", error);

        // fallback to existing passed data if backend fails
        setDashboard(data?.dashboard || null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardSummary();
  }, [data]);

  if (loading && !dashboard) {
    return (
      <div className="rounded-[2rem] border border-slate-100 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm">
        Loading dashboard summary...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <ProgressSummary dashboard={dashboard} />

          <ConceptMastery items={dashboard?.conceptMastery || []} />

          <RecentActivity items={dashboard?.recentActivities || []} />
        </div>

        <div className="space-y-8 lg:col-span-4">
          <ResumeLearningCard data={dashboard?.resumeLearning || null} />

          <LatestResources items={dashboard?.resources || []} />

          <RecentMessages items={dashboard?.messages || []} />

          <Achievements items={dashboard?.achievements || []} />
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
