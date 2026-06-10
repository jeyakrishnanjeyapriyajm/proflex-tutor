import { useEffect, useState } from "react";

import PortalLayout from "../layouts/PortalLayout";
import Card from "../components/common/Card";
import PageState from "../components/common/PageState";
import { studentTabs } from "../data/portalTabs";
import { getStudentMessages } from "../services/studentService";

const StudentMessages = () => {
  const [messagesData, setMessagesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStudentMessages();
      setMessagesData(data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <PageState loading={loading} error={error} onRetry={fetchMessages}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <h1 className="text-2xl font-black text-slate-900">Messages</h1>

            <div className="mt-6 space-y-4">
              {messagesData?.messages?.map((msg, index) => (
                <div key={index} className="rounded-2xl bg-slate-50 p-5">
                  <p className="font-black text-slate-900">{msg.sender}</p>
                  <p className="mt-2 text-sm text-slate-600">{msg.message}</p>
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    {msg.time}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h1 className="text-2xl font-black text-slate-900">
              Notifications
            </h1>

            <div className="mt-6 space-y-4">
              {messagesData?.notifications?.map((note, index) => (
                <div key={index} className="rounded-2xl bg-sky-50 p-5">
                  <p className="font-black text-sky-700">{note.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{note.message}</p>
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    {note.time}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </PageState>
    </PortalLayout>
  );
};

export default StudentMessages;
