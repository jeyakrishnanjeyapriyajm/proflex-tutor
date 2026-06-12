import DashboardTopbar from "../components/navigation/DashboardTopbar";
import DashboardTabs from "../components/common/DashboardTabs";

const PortalLayout = ({ tabs, title, subtitle, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardTabs tabs={tabs} title={title} subtitle={subtitle} />

      <div className="min-w-0 flex-1">
        <DashboardTopbar title={title} subtitle={subtitle} />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
