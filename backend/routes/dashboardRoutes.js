const express = require("express");

const { protect } = require("../middlewares/authmiddleware");
const {
  authorizeRoles,
  requireApprovedRole,
} = require("../middlewares/rolemiddleware");

const router = express.Router();

// User dashboard
router.get(
  "/user",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to User Dashboard API",
      user: req.user,
    });
  }
);

// Admin dashboard
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Admin Dashboard API",
      user: req.user,
    });
  }
);

// Instructor dashboard
router.get(
  "/instructor",
  protect,
  requireApprovedRole("instructor"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Instructor Dashboard API",
      user: req.user,
    });
  }
);

module.exports = router;