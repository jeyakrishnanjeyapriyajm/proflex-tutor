import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  MessageCircle,
  Settings,
  User,
  LogOut,
} from "lucide-react";

const iconMap = {
  Dashboard: LayoutDashboard,
  Overview: LayoutDashboard,
  Assessment: ClipboardCheck,
  Analytics: BarChart3,
  Curriculum: BookOpen,
  Resources: BookOpen,
  Messages: MessageCircle,
  Settings: Settings,
  Profile: User,
};

const PortalLayout = ({
  tabs = [],
  title = "Student Portal",
  subtitle,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (!path) return false;

    if (path === "/student") {
      return location.pathname === "/student";
    }

    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    // Clear saved authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    sessionStorage.clear();

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Top Menu */}
      <div className="sticky top-0 z-50 border-b border-slate-100 bg-white px-4 py-4 shadow-sm lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-slate-900">{title}</h1>
            {subtitle && (
              <p className="text-xs font-semibold text-slate-400">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm font-black text-sky-600"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            Menu
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-xl">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = iconMap[tab.label] || LayoutDashboard;
                const active = isActive(tab.to || tab.path);

                return (
                  <Link
                    key={tab.to || tab.path || tab.label}
                    to={tab.to || tab.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-sky-600 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </Link>
                );
              })}

              {/* Mobile Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-100 bg-white p-6 lg:flex lg:flex-col">
          <div>
            <div className="mb-8">
              <h1 className="text-xl font-black text-slate-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = iconMap[tab.label] || LayoutDashboard;
                const active = isActive(tab.to || tab.path);

                return (
                  <Link
                    key={tab.to || tab.path || tab.label}
                    to={tab.to || tab.path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-sky-600 text-white shadow-lg shadow-sky-100"
                        : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Logout Button */}
          <div className="mt-auto border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
