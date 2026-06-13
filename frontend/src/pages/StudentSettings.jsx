import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Camera,
  Lock,
  LogOut,
  Mail,
  Palette,
  Save,
  Shield,
  User,
} from "lucide-react";

import PortalLayout from "../layouts/PortalLayout";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentSettings } from "../services/studentService";
import { logout } from "../features/auth/authSlice";

const StudentSettings = () => {
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+94 77 123 4567",
    bio: "First year ICT undergraduate learning C programming with ProgFlex.",
    company: "University of Colombo",
    avatar: "https://picsum.photos/seed/user/200/200",
  });

  const [notifications, setNotifications] = useState({
    lessonReminders: true,
    aiFeedback: true,
    achievementUnlocks: true,
    emailNotifications: true,
    dashboardNotifications: true,
    securityAlerts: true,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "account",
      label: "Account Security",
      icon: Shield,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
  ];

  const roleLabel = useMemo(() => {
    if (settings?.role === "user") return "Student";
    if (settings?.role === "instructor") return "Instructor";
    if (settings?.role === "admin") return "Administrator";
    return "Student";
  }, [settings?.role]);

  const statusLabel = settings?.roleStatus || "approved";

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentSettings();
      const loadedSettings = data.settings || {};

      setSettings(loadedSettings);

      const fullName = loadedSettings.name || "Kogulan K.";
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      setProfile((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: loadedSettings.email || "",
        bio:
          loadedSettings.bio ||
          "First year ICT undergraduate learning C programming with ProgFlex.",
      }));

      setNotifications((prev) => ({
        ...prev,
        emailNotifications: Boolean(
          loadedSettings.notifications?.email ?? true,
        ),
        dashboardNotifications: Boolean(
          loadedSettings.notifications?.dashboard ?? true,
        ),
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchSettings}>
        <div className="min-h-[calc(100vh-120px)] bg-slate-50/30 font-sans">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-10">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Settings
              </h1>
              <p className="mt-2 text-base font-medium text-slate-500">
                Manage your account preferences and profile information.
              </p>
            </header>

            <div className="flex flex-col gap-10 md:flex-row">
              {/* Tabs Sidebar */}
              <aside className="w-full shrink-0 space-y-2 md:w-64">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black transition-all ${
                        activeTab === tab.id
                          ? "border border-slate-100 bg-white text-sky-600 shadow-sm"
                          : "text-slate-400 hover:bg-white hover:text-slate-600"
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  );
                })}

                <div className="mt-6 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-sm font-black text-rose-500 transition-all hover:bg-rose-50"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              </aside>

              {/* Content Card */}
              <section className="min-h-[600px] flex-1 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
                {activeTab === "profile" && (
                  <div className="p-6 sm:p-8 lg:p-10">
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h2 className="text-xl font-black text-slate-900">
                          Profile Information
                        </h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          Update your personal information and dashboard
                          profile.
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-600">
                        {statusLabel}
                      </span>
                    </div>

                    <div className="mb-10 flex flex-col items-center gap-8 rounded-[2rem] bg-slate-50 p-6 md:flex-row md:items-center">
                      <div className="group relative">
                        <div className="h-32 w-32 overflow-hidden rounded-[2rem] border-4 border-white bg-sky-50 shadow-xl">
                          <img
                            src={profile.avatar}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <button
                          type="button"
                          className="absolute -bottom-2 -right-2 rounded-xl border-2 border-white bg-sky-600 p-3 text-white shadow-lg transition-all hover:bg-sky-700 group-hover:scale-110"
                        >
                          <Camera size={18} />
                        </button>
                      </div>

                      <div className="text-center md:text-left">
                        <p className="mb-1 text-sm font-black uppercase tracking-widest text-slate-400">
                          Your Photo
                        </p>

                        <p className="mb-4 text-sm font-medium text-slate-500">
                          This will be displayed on your profile and dashboard.
                        </p>

                        <div className="flex justify-center gap-2 md:justify-start">
                          <button
                            type="button"
                            className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-black text-white transition-all hover:bg-slate-800"
                          >
                            Upload New
                          </button>

                          <button
                            type="button"
                            className="rounded-lg bg-white px-5 py-2 text-xs font-black text-slate-600 transition-all hover:bg-slate-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          First Name
                        </label>

                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          Last Name
                        </label>

                        <div className="relative">
                          <User
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full rounded-xl border border-transparent bg-slate-50 py-3 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          Email Address
                        </label>

                        <div className="relative">
                          <Mail
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                          <input
                            type="email"
                            value={profile.email}
                            readOnly
                            className="w-full cursor-not-allowed rounded-xl border border-transparent bg-slate-100 py-3 pl-12 pr-4 text-sm font-bold text-slate-400 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          Role
                        </label>

                        <div className="rounded-xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-900">
                          {roleLabel}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          Institution
                        </label>

                        <div className="rounded-xl bg-slate-50 px-5 py-3 text-sm font-black text-slate-900">
                          {profile.company}
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="ml-1 text-xs font-black uppercase tracking-widest text-slate-400">
                          Bio / Role Description
                        </label>

                        <textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              bio: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full resize-none rounded-xl border border-transparent bg-slate-50 px-5 py-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                        />
                      </div>
                    </div>

                    <div className="mt-10 flex justify-end">
                      <button
                        type="button"
                        className="flex items-center gap-2 rounded-2xl bg-sky-600 px-8 py-4 font-black text-white shadow-lg shadow-sky-100 transition-all hover:bg-sky-700"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "account" && (
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900">
                      Account Security
                    </h2>

                    <div className="space-y-8">
                      <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
                        <h3 className="mb-2 font-black text-slate-900">
                          Change Password
                        </h3>

                        <p className="mb-6 text-sm font-medium text-slate-500">
                          Update your password to keep your account secure.
                        </p>

                        <div className="space-y-4">
                          <div className="relative">
                            <Lock
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type="password"
                              placeholder="Current Password"
                              className="w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                            />
                          </div>

                          <div className="relative">
                            <Lock
                              size={16}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                              type="password"
                              placeholder="New Password"
                              className="w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
                            />
                          </div>

                          <button
                            type="button"
                            className="rounded-xl bg-slate-900 px-6 py-3 text-xs font-black text-white transition-all hover:bg-slate-800"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-black text-slate-900">
                            Two-Factor Authentication
                          </h3>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Add an extra layer of security to your account.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="flex h-6 w-12 items-center rounded-full bg-slate-200 px-1"
                        >
                          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>

                      <div className="flex flex-col gap-5 rounded-3xl border border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-black text-slate-900">
                            Session Management
                          </h3>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Logged in devices: 1 browser, 0 mobile sessions.
                          </p>
                        </div>

                        <button
                          type="button"
                          className="text-xs font-black uppercase tracking-widest text-sky-600 hover:underline"
                        >
                          Revoke All
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900">
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      {Object.entries(notifications).map(([key, value]) => {
                        const label = key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim();

                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between gap-5 border-b border-slate-50 pb-6 last:border-b-0 last:pb-0"
                          >
                            <div>
                              <h3 className="font-black text-slate-900">
                                {label}
                              </h3>

                              <p className="mt-1 text-xs font-medium text-slate-500">
                                Receive alerts for these activities via
                                dashboard and email.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleNotificationToggle(key)}
                              className={`flex h-6 w-12 shrink-0 items-center rounded-full px-1 transition-all ${
                                value ? "bg-sky-600" : "bg-slate-200"
                              }`}
                            >
                              <span
                                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                                  value ? "ml-auto" : ""
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div className="p-6 sm:p-8 lg:p-10">
                    <h2 className="mb-8 text-xl font-black text-slate-900">
                      Interface Appearance
                    </h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <button
                        type="button"
                        className="rounded-[2rem] border-2 border-sky-600 bg-sky-50/50 p-6 text-left"
                      >
                        <div className="mb-4 aspect-video w-full space-y-2 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                          <div className="h-2 w-12 rounded bg-slate-200" />
                          <div className="h-2 w-full rounded bg-slate-100" />
                          <div className="h-2 w-3/4 rounded bg-slate-100" />
                        </div>

                        <p className="font-black text-slate-900">Light Mode</p>
                        <p className="mt-1 text-xs font-bold text-slate-400">
                          Default clean interface
                        </p>
                      </button>

                      <button
                        type="button"
                        className="cursor-not-allowed rounded-[2rem] border border-slate-100 bg-slate-50 p-6 text-left grayscale"
                      >
                        <div className="mb-4 aspect-video w-full space-y-2 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
                          <div className="h-2 w-12 rounded bg-slate-700" />
                          <div className="h-2 w-full rounded bg-slate-800" />
                          <div className="h-2 w-3/4 rounded bg-slate-800" />
                        </div>

                        <p className="font-black text-slate-400">Dark Mode</p>
                        <p className="mt-1 text-xs font-bold text-slate-300">
                          Coming Soon
                        </p>
                      </button>
                    </div>

                    <div className="mt-10">
                      <h3 className="mb-4 font-black text-slate-900">
                        Sidebar Theme
                      </h3>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          className="h-10 w-10 rounded-full border border-slate-200 bg-white shadow-inner"
                        />

                        <button
                          type="button"
                          className="h-10 w-10 rounded-full bg-slate-950"
                        />

                        <button
                          type="button"
                          className="h-10 w-10 rounded-full bg-sky-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentSettings;
