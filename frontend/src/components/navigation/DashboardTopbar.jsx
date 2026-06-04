import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import Badge from "../common/Badge";

const DashboardTopbar = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-sm text-slate-500">
            Manage your workspace and account activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={user?.role === "admin" ? "red" : "green"}>
            {user?.role}
          </Badge>

          <Button variant="light" onClick={() => navigate("/")}>
            Home
          </Button>

          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
