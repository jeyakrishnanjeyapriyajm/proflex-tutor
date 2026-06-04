import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  UserCheck,
  BarChart3,
} from "lucide-react";

const DashboardSidebar = ({ role }) => {
  const adminLinks = [
    {
      label: "Overview",
      path: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Approvals",
      path: "/admin-dashboard?tab=approvals",
      icon: UserCheck,
    },
    {
      label: "Users",
      path: "/admin-dashboard?tab=users",
      icon: Users,
    },
    {
      label: "Settings",
      path: "/admin-dashboard?tab=settings",
      icon: Settings,
    },
  ];

  const instructorLinks = [
    {
      label: "Overview",
      path: "/instructor-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Courses",
      path: "/instructor-dashboard?tab=courses",
      icon: BookOpen,
    },
    {
      label: "Students",
      path: "/instructor-dashboard?tab=students",
      icon: Users,
    },
    {
      label: "Analytics",
      path: "/instructor-dashboard?tab=analytics",
      icon: BarChart3,
    },
  ];

  const userLinks = [
    {
      label: "Overview",
      path: "/user-dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Courses",
      path: "/user-dashboard?tab=courses",
      icon: BookOpen,
    },
    {
      label: "Progress",
      path: "/user-dashboard?tab=progress",
      icon: BarChart3,
    },
    {
      label: "Profile",
      path: "/user-dashboard?tab=profile",
      icon: Users,
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : role === "instructor"
        ? instructorLinks
        : userLinks;

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-100 bg-white p-6 lg:block">
      <div className="mb-10">
        <h2 className="text-xl font-black text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500 capitalize">{role} workspace</p>
      </div>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
