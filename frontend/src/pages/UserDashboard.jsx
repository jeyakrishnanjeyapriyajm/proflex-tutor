import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import UserOverview from "../components/userDashboard/UserOverview";
import UserCourses from "../components/userDashboard/UserCourses";
import UserProgress from "../components/userDashboard/UserProgress";
import UserProfile from "../components/userDashboard/UserProfile";

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: "My Courses" },
    { key: "progress", label: "Progress" },
    { key: "profile", label: "Profile" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">User Dashboard</h1>

        <p className="text-slate-500">
          Continue learning and track your course progress.
        </p>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              tab.key === "overview"
                ? setSearchParams({})
                : setSearchParams({ tab: tab.key })
            }
            className={`rounded-2xl px-5 py-4 text-sm font-bold transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <UserOverview />}
      {activeTab === "courses" && <UserCourses />}
      {activeTab === "progress" && <UserProgress />}
      {activeTab === "profile" && <UserProfile />}
    </DashboardLayout>
  );
};

export default UserDashboard;
