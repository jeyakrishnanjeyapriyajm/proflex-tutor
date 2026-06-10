import { useState } from "react";
import { useSelector } from "react-redux";
import { Bell, Search, BookOpen } from "lucide-react";
import { notifications } from "../../data/studentDashboardData";

const StudentTopbar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const hasUnread = notifications.some((item) => !item.read);

  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-bold text-sky-600">
            <BookOpen size={16} />
            Personalized Learning Path
          </div>

          <h2 className="text-2xl font-black text-slate-900">
            Welcome back, {user?.name || "Student"}!
          </h2>

          <p className="text-sm text-slate-500">
            You have mastered 42% of the C Programming Fundamentals course.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-80 sm:block">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search modules, quizzes..."
              className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-50"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`relative rounded-2xl p-3 transition ${
                showNotifications
                  ? "bg-sky-50 text-sky-600"
                  : "bg-slate-50 text-slate-500 hover:text-sky-600"
              }`}
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 z-50 mt-4 w-80 overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
                <div className="border-b border-slate-100 p-5">
                  <h3 className="font-black text-slate-900">Notifications</h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        className="border-b border-slate-50 p-5 last:border-0"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                          >
                            <Icon size={18} />
                          </div>

                          <div>
                            <div className="mb-1 flex items-start justify-between gap-3">
                              <p className="text-sm font-bold text-slate-900">
                                {item.title}
                              </p>
                              <span className="text-[10px] font-bold text-slate-400">
                                {item.time}
                              </span>
                            </div>

                            <p className="text-xs leading-5 text-slate-500">
                              {item.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTopbar;
