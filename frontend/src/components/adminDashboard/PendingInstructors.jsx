import { useEffect, useState } from "react";

import API from "../../services/api";
import Card from "../common/Card";
import Button from "../common/Button";
import Loading from "../common/Loading";
import Badge from "../common/Badge";

const PendingInstructors = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setMessage("");

      const { data } = await API.get("/admin/pending-instructors");
      setUsers(data.users || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const approveInstructor = async (userId) => {
    try {
      await API.put(`/admin/approve-instructor/${userId}`);
      setMessage("Instructor approved successfully");
      fetchPending();
    } catch (error) {
      setMessage(error.response?.data?.message || "Approval failed");
    }
  };

  const rejectInstructor = async (userId) => {
    try {
      await API.put(`/admin/reject-instructor/${userId}`, {
        reason: "Rejected by admin",
      });

      setMessage("Instructor rejected");
      fetchPending();
    } catch (error) {
      setMessage(error.response?.data?.message || "Reject failed");
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
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-900">
          Pending Instructor Requests
        </h2>

        <p className="text-slate-500">
          Approve or reject instructor dashboard access.
        </p>
      </div>

      {message && (
        <div className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          {message}
        </div>
      )}

      {users.length === 0 ? (
        <Card className="p-10 text-center">
          <h3 className="text-xl font-black text-slate-900">
            No pending requests
          </h3>

          <p className="mt-2 text-slate-500">
            New instructor requests will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <Card
              key={user._id}
              className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-black text-slate-900">{user.name}</h3>
                <p className="text-sm text-slate-500">{user.email}</p>

                <div className="mt-3">
                  <Badge variant="orange">Pending Instructor</Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="success"
                  onClick={() => approveInstructor(user._id)}
                >
                  Approve
                </Button>

                <Button
                  variant="danger"
                  onClick={() => rejectInstructor(user._id)}
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingInstructors;
