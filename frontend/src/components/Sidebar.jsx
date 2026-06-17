import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  User,
  Settings,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const linksByRole = {
    admin: [
      {
        to: "/admin",
        label: "Admin Dashboard",
        icon: ShieldCheck,
      },
      {
        to: "/admin/analysis",
        label: "Student Analysis",
        icon: BarChart3,
      },
    ],

    teacher: [
      {
        to: "/teacher",
        label: "Teacher Dashboard",
        icon: GraduationCap,
      },
    ],

    student: [
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
    ],
  };

  const links = user ? linksByRole[user.role] || [] : [];

  const isActiveLink = (path) => {
    if (path === "/student") {
      return location.pathname === "/student";
    }

    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    if (path === "/teacher") {
      return location.pathname === "/teacher";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileMenu((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-2xl border border-sky-100 bg-white px-5 py-4 text-left font-black text-slate-800 shadow-sm"
        >
          <span className="flex items-center gap-3">
            {showMobileMenu ? (
              <X size={20} className="text-sky-600" />
            ) : (
              <Menu size={20} className="text-sky-600" />
            )}
            Navigation
          </span>

          <span className="rounded-full bg-sky-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-sky-600">
            Menu
          </span>
        </button>

        {showMobileMenu && (
          <div className="mt-3 rounded-2xl border border-sky-100 bg-white p-3 shadow-lg">
            <div className="mb-3 px-3 py-2">
              <p className="text-sm font-black text-slate-900">
                {user?.role === "admin"
                  ? "Admin Navigation"
                  : user?.role === "teacher"
                    ? "Teacher Navigation"
                    : "Student Navigation"}
              </p>
              <p className="text-xs font-semibold text-slate-400">
                Select dashboard section
              </p>
            </div>

            <div className="space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActiveLink(link.to);

                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setShowMobileMenu(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-sky-600 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-lg lg:block lg:w-72">
        <h2 className="mb-4 text-lg font-semibold text-brand-900">
          Navigation
        </h2>

        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActiveLink(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
                  active
                    ? "bg-sky-600 text-white"
                    : "bg-brand-50 text-brand-800 hover:bg-brand-100"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
