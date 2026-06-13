import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  RefreshCcw,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

import {
  approveInstructorApi,
  getPendingInstructors,
  rejectInstructorApi,
} from "../../services/adminService";
import Loading from "../common/Loading";

const PendingInstructors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getPendingInstructors();
      setUsers(data.users || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const approveInstructor = async (userId) => {
    try {
      setActionLoading(userId);
      await approveInstructorApi(userId);
      setMessage("Instructor approved successfully");
      fetchPending();
    } catch (error) {
      setMessage(error.response?.data?.message || "Approval failed");
    } finally {
      setActionLoading("");
    }
  };

  const rejectInstructor = async (userId) => {
    try {
      setActionLoading(userId);
      await rejectInstructorApi(userId, "Rejected by admin");
      setMessage("Instructor rejected");
      fetchPending();
    } catch (error) {
      setMessage(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading("");
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  if (loading) {
    return <Loading text="Loading pending instructors..." />;
  }

  return (
    <div>
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Pending Instructor Requests
          </h2>

          <p className="mt-2 text-base font-medium text-slate-500">
            Approve or reject lecturer access to the instructor dashboard.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPending}
          className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition-all hover:bg-slate-50"
        >
          <RefreshCcw size={17} />
          Refresh
        </button>
      </header>

      {message && (
        <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4 text-sm font-black text-sky-700">
          {message}
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-50 text-emerald-600">
            <ShieldCheck size={38} />
          </div>

          <h3 className="text-2xl font-black text-slate-900">
            No pending requests
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
            New instructor registration requests will appear here when users ask
            for lecturer access.
          </p>
        </div>
      ) : (
        <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-50 p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <UserCheck size={24} />
              </div>

              <div>
                <h3 className="font-black text-slate-900">
                  Instructor Approval Queue
                </h3>

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {users.length} pending request{users.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex flex-col gap-5 p-6 transition-all hover:bg-slate-50/60 lg:flex-row lg:items-center lg:justify-between lg:p-8"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white">
                    {user.name?.charAt(0)?.toUpperCase() || "I"}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      {user.name}
                    </h3>

                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <Mail size={14} />
                      {user.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-600">
                        <Clock size={12} />
                        Pending Instructor
                      </span>

                      <span className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Awaiting Admin Review
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={actionLoading === user._id}
                    onClick={() => approveInstructor(user._id)}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading === user._id}
                    onClick={() => rejectInstructor(user._id)}
                    className="flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-700 disabled:opacity-60"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingInstructors;
