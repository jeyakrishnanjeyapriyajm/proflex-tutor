import { useEffect, useState } from "react";
import {
  Activity,
  Bell,
  Database,
  ShieldCheck,
  Users,
  UserCheck,
} from "lucide-react";

import { getAdminOverview } from "../../services/adminService";
import Loading from "../common/Loading";

const AdminOverview = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchOverview = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getAdminOverview();
      setOverview(data.overview);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return <Loading text="Loading admin overview..." />;
  }

  const systemStats = [
    {
      label: "Total Users",
      value: overview?.totalUsers || 0,
      trend: "Live",
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Students",
      value: overview?.totalStudents || 0,
      trend: "Active",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Instructors",
      value: overview?.totalInstructors || 0,
      trend: "Approved",
      icon: ShieldCheck,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Pending Requests",
      value: overview?.pendingInstructors || 0,
      trend: "Review",
      icon: UserCheck,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const services = [
    {
      name: "Authentication Service",
      uptime: "Active",
      latency: "OK",
    },
    {
      name: "Admin API",
      uptime: "Active",
      latency: "OK",
    },
    {
      name: "MongoDB Connection",
      uptime: "Active",
      latency: "OK",
    },
    {
      name: "Role Permission System",
      uptime: "Active",
      latency: "OK",
    },
  ];

  const alerts = [
    {
      type: "Approval",
      message: `${overview?.pendingInstructors || 0} instructor requests waiting for approval`,
      time: "Live",
      color: "bg-amber-500",
    },
    {
      type: "Users",
      message: `${overview?.inactiveUsers || 0} inactive users found`,
      time: "Live",
      color: "bg-slate-500",
    },
    {
      type: "System",
      message: "Admin backend is connected successfully",
      time: "Now",
      color: "bg-emerald-500",
    },
  ];

  return (
    <div>
      {message && (
        <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-black text-rose-700">
          {message}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {systemStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group cursor-pointer rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-sky-200 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="mb-6 flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color} shadow-sm transition-transform group-hover:scale-110`}
                >
                  <Icon size={24} />
                </div>

                <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500">
                  {stat.trend}
                </span>
              </div>

              <p className="text-4xl font-black leading-none text-slate-900">
                {stat.value}
              </p>

              <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm xl:col-span-8">
          <h2 className="mb-8 flex items-center gap-2 text-xl font-black text-slate-900">
            <Activity size={22} className="text-sky-600" />
            Service Health
          </h2>

          <div className="space-y-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="font-black text-slate-900">
                    {service.name}
                  </span>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Status
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {service.uptime}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Check
                    </p>
                    <p className="text-sm font-black text-sky-600">
                      {service.latency}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8 xl:col-span-4">
          <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-xl shadow-slate-200">
            <h2 className="mb-8 flex items-center gap-2 font-black">
              <Bell size={18} className="text-sky-400" />
              System Alerts
            </h2>

            <div className="space-y-6">
              {alerts.map((alert) => (
                <div key={alert.message} className="flex gap-4">
                  <span
                    className={`h-10 w-1.5 shrink-0 rounded-full ${alert.color}`}
                  />

                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {alert.type}
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        {alert.time}
                      </span>
                    </div>

                    <p className="text-xs font-medium leading-relaxed text-slate-300">
                      {alert.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-black text-slate-900">Internal Roles</h2>

            <div className="space-y-4">
              <RoleRow label="Admins" count={overview?.totalAdmins || 0} />
              <RoleRow
                label="Instructors"
                count={overview?.totalInstructors || 0}
              />
              <RoleRow label="Students" count={overview?.totalStudents || 0} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const RoleRow = ({ label, count }) => {
  return (
    <div className="group flex cursor-pointer items-center justify-between rounded-xl p-3 transition-colors hover:bg-slate-50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
          {label.charAt(0)}
        </div>

        <p className="text-sm font-black text-slate-900">{label}</p>
      </div>

      <span className="text-xs font-black text-slate-400 transition-colors group-hover:text-sky-600">
        {count}
      </span>
    </div>
  );
};

export default AdminOverview;
