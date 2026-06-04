import { useSelector } from "react-redux";
import DashboardSidebar from "../components/navigation/DashboardSidebar";
import DashboardTopbar from "../components/navigation/DashboardTopbar";

const DashboardLayout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <DashboardSidebar role={user?.role} />

      <div className="flex-1">
        <DashboardTopbar />

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
