const User = require("../models/User");

// ADMIN OVERVIEW
const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      pendingInstructors,
      approvedInstructors,
      rejectedInstructors,
      inactiveUsers,
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: "user", requestedRole: "user" }),
      User.countDocuments({ role: "instructor", roleStatus: "approved" }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({
        requestedRole: "instructor",
        roleStatus: "pending",
      }),
      User.countDocuments({
        requestedRole: "instructor",
        roleStatus: "approved",
      }),
      User.countDocuments({
        requestedRole: "instructor",
        roleStatus: "rejected",
      }),
      User.countDocuments({ isActive: false }),
    ]);

    return res.status(200).json({
      success: true,
      overview: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        pendingInstructors,
        approvedInstructors,
        rejectedInstructors,
        inactiveUsers,
      },
    });
  } catch (error) {
    console.error("ADMIN OVERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load admin overview",
      error: error.message,
    });
  }
};

// GET ALL USERS
const getAdminUsers = async (req, res) => {
  try {
    const { search, role, roleStatus } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && role !== "all") {
      filter.role = role;
    }

    if (roleStatus && roleStatus !== "all") {
      filter.roleStatus = roleStatus;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET ADMIN USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load users",
      error: error.message,
    });
  }
};

// GET SINGLE USER
const getAdminUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET ADMIN USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load user",
      error: error.message,
    });
  }
};

// GET PENDING INSTRUCTOR REQUESTS
const getPendingInstructors = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      requestedRole: "instructor",
      roleStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    console.error("GET PENDING INSTRUCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get pending instructor requests",
      error: error.message,
    });
  }
};

// GET APPROVED INSTRUCTORS
const getApprovedInstructors = async (req, res) => {
  try {
    const users = await User.find({
      requestedRole: "instructor",
      role: "instructor",
      roleStatus: "approved",
    })
      .select("-password")
      .sort({ approvedAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET APPROVED INSTRUCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get approved instructors",
      error: error.message,
    });
  }
};

// GET REJECTED INSTRUCTORS
const getRejectedInstructors = async (req, res) => {
  try {
    const users = await User.find({
      requestedRole: "instructor",
      roleStatus: "rejected",
    })
      .select("-password")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET REJECTED INSTRUCTORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get rejected instructors",
      error: error.message,
    });
  }
};

// APPROVE INSTRUCTOR
const approveInstructor = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.requestedRole !== "instructor") {
      return res.status(400).json({
        success: false,
        message: "This user did not request instructor role",
      });
    }

    if (user.roleStatus === "approved" && user.role === "instructor") {
      return res.status(400).json({
        success: false,
        message: "Instructor already approved",
      });
    }

    user.role = "instructor";
    user.requestedRole = "instructor";
    user.roleStatus = "approved";
    user.isActive = true;
    user.approvedBy = req.user._id || req.user.id;
    user.approvedAt = new Date();
    user.rejectedReason = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Instructor approved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
        approvedBy: user.approvedBy,
        approvedAt: user.approvedAt,
      },
    });
  } catch (error) {
    console.error("APPROVE INSTRUCTOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve instructor",
      error: error.message,
    });
  }
};

// REJECT INSTRUCTOR
const rejectInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.requestedRole !== "instructor") {
      return res.status(400).json({
        success: false,
        message: "This user did not request instructor role",
      });
    }

    user.role = "user";
    user.requestedRole = "instructor";
    user.roleStatus = "rejected";
    user.approvedBy = req.user._id || req.user.id;
    user.approvedAt = new Date();
    user.rejectedReason = reason || "Instructor request rejected by admin";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Instructor request rejected",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
        rejectedReason: user.rejectedReason,
      },
    });
  } catch (error) {
    console.error("REJECT INSTRUCTOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject instructor",
      error: error.message,
    });
  }
};

// ACTIVATE USER
const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      user,
    });
  } catch (error) {
    console.error("ACTIVATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to activate user",
      error: error.message,
    });
  }
};

// DEACTIVATE USER
const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if ((req.user._id || req.user.id).toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot deactivate own account",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deactivated successfully",
      user,
    });
  } catch (error) {
    console.error("DEACTIVATE USER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate user",
      error: error.message,
    });
  }
};

// CHANGE USER ROLE
const changeUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!["user", "admin", "instructor"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    if ((req.user._id || req.user.id).toString() === userId && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot remove own admin role",
      });
    }

    const updateData = {
      role,
      requestedRole: role,
      roleStatus: "approved",
      isActive: true,
    };

    if (role === "admin" || role === "instructor") {
      updateData.approvedBy = req.user._id || req.user.id;
      updateData.approvedAt = new Date();
      updateData.rejectedReason = "";
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("CHANGE USER ROLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change user role",
      error: error.message,
    });
  }
};

module.exports = {
  getAdminOverview,
  getAdminUsers,
  getAdminUserById,
  getPendingInstructors,
  getApprovedInstructors,
  getRejectedInstructors,
  approveInstructor,
  rejectInstructor,
  activateUser,
  deactivateUser,
  changeUserRole,
};