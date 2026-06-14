import { useEffect, useMemo, useState } from "react";
import { Edit3, RefreshCcw, Search, ShieldCheck, Trash2 } from "lucide-react";

import {
  activateUserApi,
  changeUserRoleApi,
  deactivateUserApi,
  getAdminUsers,
} from "../../services/adminService";
import Loading from "../common/Loading";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await getAdminUsers({
        search: searchTerm,
        role: roleFilter,
      });

      setUsers(data.users || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const handleDeactivate = async (userId) => {
    try {
      await deactivateUserApi(userId);
      setMessage("User deactivated successfully");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to deactivate user");
    }
  };

  const handleActivate = async (userId) => {
    try {
      await activateUserApi(userId);
      setMessage("User activated successfully");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to activate user");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await changeUserRoleApi(userId, role);
      setMessage("User role updated successfully");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update role");
    }
  };

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Admins", value: "admin" },
    { label: "Inst.", value: "instructor" },
    { label: "Stud.", value: "user" },
  ];

  if (loading) {
    return <Loading text="Loading users..." />;
  }

  return (
    <div>
      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            User Management
          </h2>

          <p className="mt-2 text-base font-medium text-slate-500">
            Manage institutional access, roles, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
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

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-50 p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-transparent bg-slate-50 py-3.5 pl-12 pr-4 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-sky-100 focus:ring-4 focus:ring-sky-600/10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setRoleFilter(filter.value)}
                className={`rounded-xl border px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                  roleFilter === filter.value
                    ? "border-sky-600 bg-sky-600 text-white"
                    : "border-slate-100 bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                <th className="px-8 py-4">User Identity</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Requested Role</th>
                <th className="px-8 py-4 text-center">Status</th>
                <th className="px-8 py-4 text-center">Account</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="group transition-colors hover:bg-slate-50/50"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-500">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>

                      <div>
                        <p className="text-sm font-black uppercase tracking-tight text-slate-900 transition-colors group-hover:text-sky-600">
                          {user.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs font-black uppercase text-slate-700 outline-none focus:ring-4 focus:ring-sky-600/10"
                    >
                      <option value="user">Student</option>
                      <option value="instructor">Instructor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="px-8 py-5 text-xs font-black uppercase text-slate-400">
                    {user.requestedRole}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          user.roleStatus === "approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : user.roleStatus === "pending"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {user.roleStatus}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-xl p-2 text-slate-400 transition-all hover:bg-sky-50 hover:text-sky-600"
                        title="View/Edit"
                      >
                        <Edit3 size={18} />
                      </button>

                      {user.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(user._id)}
                          className="rounded-xl p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                          title="Deactivate"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivate(user._id)}
                          className="rounded-xl p-2 text-slate-400 transition-all hover:bg-emerald-50 hover:text-emerald-600"
                          title="Activate"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-8 py-12 text-center text-sm font-bold text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
