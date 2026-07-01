import PortalLayout from "../layouts/PortalLayout";
import { adminTabs } from "../data/portalTabs";
import MessageCenter from "../components/messages/MessageCenter";

const AdminMessages = () => {
  return (
    <PortalLayout
      tabs={adminTabs}
      title="Admin Portal"
      subtitle="Student communication"
    >
      <MessageCenter role="admin" />
    </PortalLayout>
  );
};

export default AdminMessages;
