import { useSearchParams } from "react-router-dom";
import { LayoutDashboard, BookOpen, Users, BarChart3 } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardTabs from "../components/common/DashboardTabs";

import InstructorOverview from "../components/instructorDashboard/InstructorOverview";
import InstructorCourses from "../components/instructorDashboard/InstructorCourses";
import InstructorStudents from "../components/instructorDashboard/InstructorStudents";
import InstructorAnalytics from "../components/instructorDashboard/InstructorAnalytics";

const InstructorDashboard = () => {
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "overview";

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      description: "Teaching summary",
    },
    {
      key: "courses",
      label: "Courses",
      icon: BookOpen,
      description: "Course modules",
    },
    {
      key: "students",
      label: "Students",
      icon: Users,
      description: "Learner progress",
    },
    {
      key: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Class insights",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardTabs
          tabs={tabs}
          title="Instructor Panel"
          subtitle="Teaching workspace"
        />

        <div className="min-w-0 flex-1">
          {activeTab === "overview" && <InstructorOverview />}
          {activeTab === "courses" && <InstructorCourses />}
          {activeTab === "students" && <InstructorStudents />}
          {activeTab === "analytics" && <InstructorAnalytics />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorDashboard;
