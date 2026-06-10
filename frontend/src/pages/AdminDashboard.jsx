import { useSearchParams } from "react-router-dom";
import { LayoutDashboard, UserCheck, Users, Settings } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardTabs from "../components/common/DashboardTabs";

import AdminOverview from "../components/adminDashboard/AdminOverview";
import PendingInstructors from "../components/adminDashboard/PendingInstructors";
import AdminUsers from "../components/adminDashboard/AdminUsers";
import AdminSettings from "../components/adminDashboard/AdminSettings";

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      description: "System summary",
    },
    {
      key: "approvals",
      label: "Approvals",
      icon: UserCheck,
      description: "Instructor requests",
    },
    {
      key: "users",
      label: "Users",
      icon: Users,
      description: "Manage accounts",
    },
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      description: "Platform settings",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardTabs
          tabs={tabs}
          title="Admin Panel"
          subtitle="Manage platform access"
        />

        <div className="min-w-0 flex-1">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "approvals" && <PendingInstructors />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
