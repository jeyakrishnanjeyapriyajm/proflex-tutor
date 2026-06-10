import React from "react";

const AdminLecturers = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Lecturer Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage lecturer accounts, approvals, and teaching access.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Total Lecturers</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">12</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Approved Lecturers</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">8</h2>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">Pending Approvals</p>
            <h2 className="mt-2 text-3xl font-bold text-amber-600">4</h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Lecturer List
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Dr. Nimal Perera
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    nimal@example.com
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Approved
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">Instructor</td>
                  <td className="px-5 py-4">
                    <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700">
                      View
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Ms. Tharushi Silva
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    tharushi@example.com
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">Instructor</td>
                  <td className="px-5 py-4">
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700">
                      Approve
                    </button>
                  </td>
                </tr>

                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Mr. Suresh Kumar
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    suresh@example.com
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Approved
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-600">Instructor</td>
                  <td className="px-5 py-4">
                    <button className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700">
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLecturers;
