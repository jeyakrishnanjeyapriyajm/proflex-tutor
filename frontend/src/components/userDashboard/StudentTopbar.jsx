import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  ClipboardCheck,
  User,
  Settings,
} from "lucide-react";

const StudentTopbar = ({ user, dashboard }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mobileLinks = [
    {
      to: "/student",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/student/assessment",
      label: "Assessment",
      icon: ClipboardCheck,
    },
    {
      to: "/student/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      to: "/student/profile",
      label: "Profile",
      icon: User,
    },
    {
      to: "/student/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="sticky top-0 z-40 -mx-8 -mt-8 border-b border-slate-100 bg-white px-4 py-4 sm:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Dashboard Menu Button */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setShowMobileMenu((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm font-black text-sky-600 transition-all hover:bg-sky-100"
          >
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            Dashboard
          </button>

          {showMobileMenu && (
            <>
              <button
                type="button"
                aria-label="Close mobile menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setShowMobileMenu(false)}
              />

              <div className="absolute left-0 z-50 mt-3 w-72 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white text-left shadow-2xl">
                <div className="border-b border-slate-50 px-5 py-4">
                  <p className="text-sm font-black text-slate-900">
                    Student Navigation
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    Choose dashboard section
                  </p>
                </div>

                <div className="p-3">
                  {mobileLinks.map((link) => {
                    const Icon = link.icon;

                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-sky-600"
                      >
                        <Icon size={18} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Search */}
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

        {/* Profile */}
        <div className="ml-auto flex items-center gap-4">
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

      {/* Welcome Text */}
      <div className="mt-8 text-left">
        <div className="mb-1 flex items-center gap-2 text-sm font-bold text-sky-600">
          <BookOpen size={14} />
          <span>Personalized Learning Path</span>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome back, {user?.name || "Student"}!
        </h2>

        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          You&apos;ve mastered {dashboard?.completion || 0}% of the{" "}
          {dashboard?.courseTitle || "C Programming Fundamentals"} course.
        </p>
      </div>
    </div>
  );
};

export default StudentTopbar;
