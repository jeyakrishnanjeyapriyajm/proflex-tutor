import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import InstructorOverview from "../components/instructorDashboard/InstructorOverview";

const InstructorDashboard = () => {
  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="C programming teaching workspace"
    >
      <InstructorOverview />
    </PortalLayout>
  );
};

export default InstructorDashboard;
