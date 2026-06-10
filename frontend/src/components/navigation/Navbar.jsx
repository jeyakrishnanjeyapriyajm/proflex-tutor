import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown,
  Home,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../features/auth/authSlice";
import { getDashboardPath } from "../../utils/redirectByRole";
import Button from "../common/Button";
import Badge from "../common/Badge";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const currentPath = location.pathname;

  const isDashboardPage =
    currentPath.startsWith("/student") ||
    currentPath.startsWith("/lecturer") ||
    currentPath.startsWith("/admin") ||
    currentPath === "/user-dashboard" ||
    currentPath === "/instructor-dashboard" ||
    currentPath === "/admin-dashboard";

  const scrollToSection = (id) => {
    if (currentPath !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(id);
        section?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } else {
      const section = document.getElementById(id);
      section?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMobileOpen(false);
  };

  const handleDashboard = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    navigate(getDashboardPath(user));
  };

  const handleProfile = () => {
    setProfileOpen(false);
    setMobileOpen(false);

    if (user?.role === "admin") {
      navigate("/admin/settings");
    } else if (user?.role === "instructor") {
      navigate("/lecturer/settings");
    } else {
      navigate("/student/settings");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const getInitial = () => {
    return user?.name?.charAt(0)?.toUpperCase() || "P";
  };

  const getRoleBadgeVariant = () => {
    if (user?.role === "admin") return "red";
    if (user?.roleStatus === "pending") return "orange";
    if (user?.role === "instructor") return "green";
    return "blue";
  };

  const getRoleLabel = () => {
    if (user?.roleStatus === "pending") return "Pending";
    if (user?.role === "admin") return "Admin";
    if (user?.role === "instructor") return "Lecturer";
    return "Student";
  };

  const landingLinks = [
    {
      label: "Home",
      icon: Home,
      action: () => {
        setMobileOpen(false);
        navigate("/");
      },
    },
    {
      label: "Features",
      action: () => scrollToSection("features"),
    },
    {
      label: "How It Works",
      action: () => scrollToSection("how-it-works"),
    },
    {
      label: "Curriculum",
      action: () => scrollToSection("curriculum"),
    },
    {
      label: "About Us",
      action: () => scrollToSection("about-us"),
    },
  ];

  return (
    <header className="sticky left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
            <BrainCircuit size={24} />
          </div>

          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              ProgFlex
            </h1>
            <p className="text-xs font-semibold text-slate-500">
              AI Coding Tutor
            </p>
          </div>
        </Link>

        {!isDashboardPage ? (
          <nav className="hidden items-center gap-1 lg:flex">
            {landingLinks.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                >
                  {Icon && <Icon size={16} />}
                  {item.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden text-center lg:block">
            <p className="text-sm font-black text-slate-900">
              Dashboard Workspace
            </p>
            <p className="text-xs font-semibold text-slate-500">
              Manage your learning activity
            </p>
          </div>
        )}

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              {!isDashboardPage && (
                <button
                  onClick={handleDashboard}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 transition hover:border-sky-100 hover:bg-sky-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-sm font-black text-white shadow-sm">
                    {getInitial()}
                  </div>

                  <div className="hidden text-left xl:block">
                    <p className="max-w-[150px] truncate text-sm font-black text-slate-900">
                      {user?.name || "Account"}
                    </p>
                    <p className="max-w-[170px] truncate text-xs font-medium text-slate-500">
                      {user?.email}
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <>
                    <button
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setProfileOpen(false)}
                      aria-label="Close menu"
                    />

                    <div className="absolute right-0 z-50 mt-4 w-72 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/70">
                      <div className="border-b border-slate-100 p-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-base font-black text-white">
                            {getInitial()}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-900">
                              {user?.name || "Account"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Badge variant={getRoleBadgeVariant()}>
                            {getRoleLabel()}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3">
                        <button
                          onClick={handleDashboard}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard
                        </button>

                        <button
                          onClick={handleProfile}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          <User size={18} />
                          Profile
                        </button>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
              >
                Sign In
              </button>

              <button
                onClick={() => navigate("/register/student")}
                className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition-all hover:bg-sky-700"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 md:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-6 py-5 md:hidden">
          <div className="space-y-4">
            {!isDashboardPage &&
              landingLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50"
                  >
                    {Icon && <Icon size={17} />}
                    {item.label}
                  </button>
                );
              })}

            <div className="border-t border-slate-100 pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 font-black text-white">
                        {getInitial()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black text-slate-900">
                          {user?.name || "Account"}
                        </p>
                        <p className="truncate text-sm text-slate-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    <Badge variant={getRoleBadgeVariant()}>
                      {getRoleLabel()}
                    </Badge>
                  </div>

                  <button
                    onClick={handleDashboard}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid gap-3">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register/student");
                    }}
                    className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
