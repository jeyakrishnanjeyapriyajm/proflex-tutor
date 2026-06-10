import { useSearchParams } from "react-router-dom";
import { BookOpen, BrainCircuit, BarChart3, User } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardTabs from "../components/common/DashboardTabs";

import UserOverview from "../components/userDashboard/UserOverview";
import UserCourses from "../components/userDashboard/UserCourses";
import UserProgress from "../components/userDashboard/UserProgress";
import UserProfile from "../components/userDashboard/UserProfile";

const UserDashboard = () => {
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: BrainCircuit,
      description: "Learning summary",
    },
    {
      key: "courses",
      label: "C Modules",
      icon: BookOpen,
      description: "Easy to hard tasks",
    },
    {
      key: "progress",
      label: "Progress",
      icon: BarChart3,
      description: "Mastery tracking",
    },
    {
      key: "profile",
      label: "Profile",
      icon: User,
      description: "Account details",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardTabs
          tabs={tabs}
          title="Student Panel"
          subtitle="C programming workspace"
        />

        <div className="min-w-0 flex-1">
          {activeTab === "overview" && <UserOverview />}
          {activeTab === "courses" && <UserCourses />}
          {activeTab === "progress" && <UserProgress />}
          {activeTab === "profile" && <UserProfile />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
