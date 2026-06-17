import PortalLayout from "../layouts/PortalLayout";
import UserOverview from "../components/userDashboard/UserOverview";
import { studentTabs } from "../data/portalTabs";
import { studentDashboardMockData } from "../data/studentDashboardData";

const StudentDashboard = () => {
  return (
    <PortalLayout tabs={studentTabs} title="Student Portal">
      <UserOverview data={studentDashboardMockData} />
    </PortalLayout>
  );
};

export default StudentDashboard;
