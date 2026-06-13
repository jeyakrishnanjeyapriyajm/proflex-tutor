import { useSearchParams } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCheck,
  Users,
  BookOpen,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import AdminOverview from "../components/adminDashboard/AdminOverview";
import PendingInstructors from "../components/adminDashboard/PendingInstructors";
import AdminUsers from "../components/adminDashboard/AdminUsers";
import AdminSettings from "../components/adminDashboard/AdminSettings";

import AdminCurriculum from "../components/adminDashboard/AdminCurriculum";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    {
      key: "curriculum",
      label: "Curriculum",
      icon: BookOpen,
      description: "Manage modules",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50/50 font-sans">
        {/* Page Header */}
        <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Admin Control Center
            </h1>

            <p className="mt-2 text-base font-medium text-slate-500">
              Global system monitoring and administrative management.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: "overview" })}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
              <Activity size={18} />
              View Health
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: "settings" })}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 transition-all hover:bg-slate-800"
            >
              <ShieldCheck size={18} />
              Global Config
            </button>
          </div>
        </header>

        {/* Admin Tabs */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSearchParams({ tab: tab.key })}
                className={`group rounded-[2rem] border p-5 text-left shadow-sm transition-all ${
                  isActive
                    ? "border-sky-200 bg-white shadow-sky-100/60"
                    : "border-slate-100 bg-white hover:border-sky-100 hover:shadow-lg hover:shadow-slate-200/60"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all ${
                      isActive
                        ? "bg-sky-600 text-white"
                        : "bg-slate-50 text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-600"
                    }`}
                  >
                    <Icon size={22} />
                  </div>

                  {isActive && (
                    <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600">
                      Active
                    </span>
                  )}
                </div>

                <p
                  className={`text-sm font-black ${
                    isActive ? "text-sky-600" : "text-slate-900"
                  }`}
                >
                  {tab.label}
                </p>

                <p className="mt-1 text-xs font-bold text-slate-400">
                  {tab.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Content */}
        <div className="min-w-0">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "approvals" && <PendingInstructors />}
          {activeTab === "users" && <AdminUsers />}
          {activeTab === "settings" && <AdminSettings />}
          {activeTab === "curriculum" && <AdminCurriculum />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
