import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import InstructorOverview from "../components/instructorDashboard/InstructorOverview";
import InstructorCourses from "../components/instructorDashboard/InstructorCourses";
import InstructorStudents from "../components/instructorDashboard/InstructorStudents";
import InstructorAnalytics from "../components/instructorDashboard/InstructorAnalytics";

const InstructorDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "courses", label: "Courses" },
    { key: "students", label: "Students" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Instructor Dashboard
        </h1>

        <p className="text-slate-500">
          Manage your courses, students and performance insights.
        </p>
      </div>

      <div className="mb-8 flex overflow-x-auto rounded-2xl bg-white p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              tab.key === "overview"
                ? setSearchParams({})
                : setSearchParams({ tab: tab.key })
            }
            className={`min-w-fit rounded-xl px-5 py-3 text-sm font-bold transition ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <InstructorOverview />}
      {activeTab === "courses" && <InstructorCourses />}
      {activeTab === "students" && <InstructorStudents />}
      {activeTab === "analytics" && <InstructorAnalytics />}
    </DashboardLayout>
  );
};

export default InstructorDashboard;
