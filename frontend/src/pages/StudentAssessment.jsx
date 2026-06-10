import PortalLayout from "../layouts/PortalLayout";
import StudentTaskGivingPanel from "../components/userDashboard/StudentTaskGivingPanel";
import { studentTabs } from "../data/portalTabs";

const StudentAssessment = () => {
  return (
    <PortalLayout
      tabs={studentTabs}
      title="Student Portal"
      subtitle="C programming workspace"
    >
      <StudentTaskGivingPanel />
    </PortalLayout>
  );
};

export default StudentAssessment;
