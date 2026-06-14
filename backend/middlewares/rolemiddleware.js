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
const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No user found.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }

  next();
};

const instructorOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No user found.",
    });
  }

  if (req.user.role !== "instructor" || req.user.roleStatus !== "approved") {
    return res.status(403).json({
      success: false,
      message: "Approved instructor access only",
    });
  }

  next();
};



module.exports = {
  authorizeRoles,
  requireApprovedRole,
  adminOnly,
  instructorOnly,
};