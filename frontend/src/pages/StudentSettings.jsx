import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import Badge from "../components/common/Badge";
import { studentTabs } from "../data/portalTabs";
import { getStudentSettings } from "../services/studentService";

const StudentSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentSettings();
      setSettings(data.settings);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchSettings}>
        <Card className="p-8">
          <h1 className="text-2xl font-black text-slate-900">
            Profile Settings
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Name</p>
              <p className="mt-1 font-black text-slate-900">{settings?.name}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">
                Email
              </p>
              <p className="mt-1 font-black text-slate-900">
                {settings?.email}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">Role</p>
              <div className="mt-2">
                <Badge>
                  {settings?.role === "user" ? "Student" : settings?.role}
                </Badge>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase text-slate-400">
                Status
              </p>
              <div className="mt-2">
                <Badge variant="green">{settings?.roleStatus}</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-8">
          <h2 className="text-xl font-black text-slate-900">
            Notification Settings
          </h2>

          <div className="mt-5 space-y-3">
            <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-bold text-slate-700">
                Email Notifications
              </span>
              <Badge variant={settings?.notifications?.email ? "green" : "red"}>
                {settings?.notifications?.email ? "On" : "Off"}
              </Badge>
            </div>

            <div className="flex justify-between rounded-2xl bg-slate-50 p-4">
              <span className="font-bold text-slate-700">
                Dashboard Notifications
              </span>
              <Badge
                variant={settings?.notifications?.dashboard ? "green" : "red"}
              >
                {settings?.notifications?.dashboard ? "On" : "Off"}
              </Badge>
            </div>
          </div>
        </Card>
      </PageState>
    </PortalLayout>
  );
};

export default StudentSettings;
