import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  LogOut,
  Home,
} from "lucide-react";

import { logout } from "../../features/auth/authSlice";
import { studentDashboardMockData } from "../../data/studentDashboardData";

const notificationIcons = {
  lesson: BookOpen,
  success: CheckCircle2,
  system: BrainCircuit,
};

const notificationStyles = {
  lesson: "bg-sky-50 text-sky-600",
  success: "bg-emerald-50 text-emerald-600",
  system: "bg-amber-50 text-amber-600",
};

const DashboardTopbar = ({
  title = "Student Portal",
  subtitle = "C programming workspace",
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const { user: authUser } = useSelector((state) => state.auth);
  const user = authUser || studentDashboardMockData.user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const notifications = studentDashboardMockData.dashboard.notifications || [];
  const hasUnread = notifications.some((item) => !item.read);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-100 bg-white px-8 py-4">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-900">{title}</h1>
          <p className="text-sm font-medium text-slate-500">{subtitle}</p>
        </div>

        <div className="hidden w-96 lg:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search lessons, docs..."
              className="w-full rounded-xl border-0 bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-600/10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="hidden rounded-xl bg-slate-50 p-2.5 text-slate-400 transition hover:text-sky-600 md:inline-flex"
            title="Home"
          >
            <Home size={20} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`relative rounded-xl p-2.5 transition-all ${
                showNotifications
                  ? "bg-sky-50 text-sky-600"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              }`}
            >
              <Bell size={20} />

              {hasUnread && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
              )}
            </button>

            {showNotifications && (
              <>
                <button
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                />

                <div className="absolute right-0 z-50 mt-4 w-96 overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-50 p-6">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((item) => {
                      const Icon = notificationIcons[item.type] || BookOpen;
                      const style =
                        notificationStyles[item.type] ||
                        "bg-slate-50 text-slate-600";

                      return (
                        <div
                          key={item.id}
                          className="border-b border-slate-50 p-6 transition last:border-0 hover:bg-slate-50"
                        >
                          <div className="flex gap-4">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style}`}
                            >
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-3">
                                <p className="truncate text-sm font-bold text-slate-900">
                                  {item.title}
                                </p>
                                <span className="shrink-0 text-[10px] font-bold text-slate-400">
                                  {item.time}
                                </span>
                              </div>

                              <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                                {item.message}
                              </p>
                            </div>

                            {!item.read && (
                              <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-8 w-px bg-slate-100" />

          <button className="group flex items-center gap-4 rounded-2xl p-1.5 text-left transition hover:bg-slate-50">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold leading-tight text-slate-900 group-hover:text-sky-600">
                {user?.name || "Student"}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {user?.role || "First Year ICT"}
              </p>
            </div>

            <div className="h-11 w-11 overflow-hidden rounded-xl border border-sky-200 bg-sky-100 shadow-sm group-hover:ring-4 group-hover:ring-sky-600/10">
              <img
                src={user?.avatar || "https://picsum.photos/seed/user/200/200"}
                alt={user?.name || "Student"}
                className="h-full w-full object-cover"
              />
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-50 p-2.5 text-red-500 transition hover:bg-red-100"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
