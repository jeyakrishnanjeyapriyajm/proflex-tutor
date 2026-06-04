export const getDashboardPath = (user) => {
  if (!user) return "/login";

  if (user.role === "admin") {
    return "/admin-dashboard";
  }

  if (user.role === "instructor" && user.roleStatus === "approved") {
    return "/instructor-dashboard";
  }

  if (
    user.requestedRole === "instructor" &&
    user.roleStatus === "pending"
  ) {
    return "/approval-pending";
  }

  return "/user-dashboard";
};