import PortalLayout from "../layouts/PortalLayout";
import { lecturerTabs } from "../data/portalTabs";
import MessageCenter from "../components/messages/MessageCenter";

const LecturerMessages = () => {
  return (
    <PortalLayout
      tabs={lecturerTabs}
      title="Lecturer Portal"
      subtitle="Student communication"
    >
      <MessageCenter role="lecturer" />
    </PortalLayout>
  );
};

export default LecturerMessages;
