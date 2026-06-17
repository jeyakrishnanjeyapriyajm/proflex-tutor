import PortalLayout from "../layouts/PortalLayout";
import UserOverview from "../components/userDashboard/UserOverview";
import { studentTabs } from "../data/portalTabs";

const StudentDashboard = () => {
  return (
    <PortalLayout tabs={studentTabs} title="Student Portal">
      <UserOverview />
    </PortalLayout>
  );
};

export default StudentDashboard;
