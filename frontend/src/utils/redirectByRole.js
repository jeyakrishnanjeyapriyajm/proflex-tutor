export const getDashboardPath = (user) => {
  if (!user) return "/login";

  if (user.role === "admin") {
    return "/admin/dashboard";
  }

  // Approved lecturer / instructor
  if (
    user.role === "instructor" &&
    (user.roleStatus === "approved" ||
      user.status === "approved" ||
      user.isApproved === true ||
      user.approved === true)
  ) {
    return "/lecturer/dashboard";
  }

  // Pending lecturer / instructor
  if (
    (user.role === "instructor" || user.requestedRole === "instructor") &&
    (user.roleStatus === "pending" ||
      user.status === "pending" ||
      user.isApproved === false ||
      user.approved === false)
  ) {
    return "/approval-pending";
  }

  return "/student/dashboard";
};