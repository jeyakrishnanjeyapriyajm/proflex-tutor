const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You do not have permission.",
      });
    }

    next();
  };
};

const requireApprovedRole = (roleName) => {
  return (req, res, next) => {
    if (
      req.user.role !== roleName ||
      req.user.roleStatus !== "approved"
    ) {
      return res.status(403).json({
        success: false,
        message: `${roleName} role is not approved yet.`,
      });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  requireApprovedRole,
};