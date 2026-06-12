import { useState } from "react";
import {
  Bell,
  Search,
  BookOpen,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

const notificationIcons = {
  lesson: BookOpen,
  success: CheckCircle2,
  system: BrainCircuit,
};

const notificationStyles = {
  lesson: {
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  success: {
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  system: {
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

const StudentTopbar = ({ user, dashboard }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = dashboard?.notifications || [];
  const hasUnread = notifications.some((item) => !item.read);

  return (
    <div className="sticky top-0 z-40 -mx-8 -mt-8 border-b border-slate-100 bg-white px-8 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="hidden w-96 sm:block">
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

        <div className="ml-auto flex items-center gap-4">
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
                  type="button"
                  aria-label="Close notifications"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowNotifications(false)}
                />

                <div className="absolute right-0 z-50 mt-4 w-96 origin-top-right overflow-hidden rounded-[2rem] border border-slate-100 bg-white text-left shadow-2xl">
                  <div className="flex items-center justify-between border-b border-slate-50 p-6">
                    <h3 className="font-bold text-slate-900">Notifications</h3>

                    <button className="text-[10px] font-black uppercase tracking-widest text-sky-600 hover:underline">
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 && (
                      <div className="p-6 text-sm font-medium text-slate-400">
                        No notifications yet.
                      </div>
                    )}

                    {notifications.map((item) => {
                      const Icon = notificationIcons[item.type] || BookOpen;
                      const style = notificationStyles[item.type] || {
                        color: "text-slate-600",
                        bg: "bg-slate-50",
                      };

                      return (
                        <div
                          key={item.id}
                          className="group cursor-pointer border-b border-slate-50 p-6 transition-colors last:border-0 hover:bg-slate-50"
                        >
                          <div className="flex gap-4">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.color}`}
                            >
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-start justify-between gap-3">
                                <p
                                  className={`truncate text-sm font-bold ${
                                    item.read
                                      ? "text-slate-600"
                                      : "text-slate-900"
                                  }`}
                                >
                                  {item.title}
                                </p>

                                <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-slate-400">
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

                  <button className="w-full bg-slate-50 py-4 text-xs font-bold text-slate-400 transition-all hover:bg-sky-100 hover:text-sky-600">
                    View All Activity
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mx-2 h-8 w-px bg-slate-100" />

          <button className="group flex items-center gap-4 rounded-2xl p-1.5 text-left transition-all hover:bg-slate-50">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold leading-tight text-slate-900 transition-colors group-hover:text-sky-600">
                {user?.name || "Student"}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {user?.role || "First Year ICT"}
              </p>
            </div>

            <div className="h-11 w-11 overflow-hidden rounded-xl border border-sky-200 bg-sky-100 shadow-sm transition-all group-hover:ring-4 group-hover:ring-sky-600/10">
              <img
                src={user?.avatar || "https://picsum.photos/seed/user/200/200"}
                alt={user?.name || "Student"}
                className="h-full w-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>

      <div className="mt-8 text-left">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-sky-600">
          <BookOpen size={14} />
          <span>Personalized Learning Path</span>
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Welcome back, {user?.name || "Student"}!
        </h2>

        <p className="mt-1 text-slate-500">
          You&apos;ve mastered {dashboard?.completion || 0}% of the{" "}
          {dashboard?.courseTitle || "C Programming Fundamentals"} course.
        </p>
      </div>
    </div>
  );
};

export default StudentTopbar;
