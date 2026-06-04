import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ children, allowedRoles, requireApproved = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    if (
      user?.requestedRole === "instructor" &&
      user?.roleStatus === "pending"
    ) {
      return <Navigate to="/approval-pending" replace />;
    }

    return <Navigate to="/unauthorized" replace />;
  }

  if (requireApproved && user?.roleStatus !== "approved") {
    return <Navigate to="/approval-pending" replace />;
  }

  return children;
};

export default RoleRoute;
