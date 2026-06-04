const User = require("../models/User");

// GET PENDING INSTRUCTOR REQUESTS
const getPendingInstructors = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      requestedRole: "instructor",
      roleStatus: "pending",
    }).select("-password");

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
    user.roleStatus = "approved";
    user.approvedBy = req.user.id;
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
    user.roleStatus = "rejected";
    user.approvedBy = req.user.id;
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

module.exports = {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
};