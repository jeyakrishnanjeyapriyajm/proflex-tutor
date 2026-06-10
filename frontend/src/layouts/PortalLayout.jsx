import DashboardLayout from "./DashboardLayout";
import DashboardTabs from "../components/common/DashboardTabs";

const PortalLayout = ({ tabs, title, subtitle, children }) => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 lg:flex-row">
        <DashboardTabs tabs={tabs} title={title} subtitle={subtitle} />

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </DashboardLayout>
  );
};

export default PortalLayout;
