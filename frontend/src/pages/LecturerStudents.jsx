import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import { getLecturerStudents } from "../services/lecturerService";

const LecturerStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await getLecturerStudents();
      setStudents(data.students || []);
    } catch (error) {
      console.error("LOAD LECTURER STUDENTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Student monitoring"
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-black text-slate-900">Students</h1>

        {loading && (
          <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-500">
            Loading students...
          </div>
        )}

        <div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-widest text-slate-400">
                <th className="pb-4">Student</th>
                <th className="pb-4">Completed Modules</th>
                <th className="pb-4">Attempts</th>
                <th className="pb-4">Correct</th>
                <th className="pb-4">Accuracy</th>
                <th className="pb-4">Stuck</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-slate-50 text-sm"
                >
                  <td className="py-4">
                    <p className="font-black text-slate-900">
                      {student.name || "Student"}
                    </p>
                    <p className="text-xs font-semibold text-slate-400">
                      {student.email}
                    </p>
                  </td>

                  <td className="py-4">{student.completedModules}</td>
                  <td className="py-4">{student.totalAttempts}</td>
                  <td className="py-4 text-emerald-600">
                    {student.correctAttempts}
                  </td>
                  <td className="py-4">{student.accuracy}%</td>
                  <td className="py-4 text-orange-600">
                    {student.stuckEvents}
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        student.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {student.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LecturerStudents;
