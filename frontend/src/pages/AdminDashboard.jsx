import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import AdminOverview from "../components/adminDashboard/AdminOverview";
import PendingInstructors from "../components/adminDashboard/PendingInstructors";
import AdminUsers from "../components/adminDashboard/AdminUsers";
import AdminSettings from "../components/adminDashboard/AdminSettings";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "approvals", label: "Approvals" },
    { key: "users", label: "Users" },
    { key: "settings", label: "Settings" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>

        <p className="text-slate-500">
          Manage instructor approvals, users and platform settings.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              tab.key === "overview"
                ? setSearchParams({})
                : setSearchParams({ tab: tab.key })
            }
            className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <AdminOverview />}
      {activeTab === "approvals" && <PendingInstructors />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "settings" && <AdminSettings />}
    </DashboardLayout>
  );
};

export default AdminDashboard;
