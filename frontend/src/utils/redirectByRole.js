export const getDashboardPath = (user) => {
  if (!user) return "/login";

  if (user.role === "admin") {
    return "/admin/dashboard";
  }

  if (user.role === "instructor" && user.roleStatus === "approved") {
    return "/lecturer/overview";
  }

  if (
    user.requestedRole === "instructor" &&
    user.roleStatus === "pending"
  ) {
    return "/approval-pending";
  }

  return "/student/dashboard";
};