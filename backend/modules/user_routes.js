const express = require("express");

const {
  getStudentDashboard,
  getStudentAnalytics,
  getStudentWorkspace,
  getStudentCurriculum,
  getStudentAssessment,
  getStudentResources,
  getStudentMessages,
  getStudentSettings,
} = require("../controllers/usercontroller");

const { protect } = require("../middlewares/authmiddleware");
const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

// Student Dashboard
router.get(
  "/student-dashboard",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentDashboard
);

// Student Analytics
router.get(
  "/student-analytics",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentAnalytics
);

// Student Workspace
router.get(
  "/student-workspace",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentWorkspace
);

// Student Curriculum
router.get(
  "/student-curriculum",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentCurriculum
);

// Student Assessment
router.get(
  "/student-assessment",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentAssessment
);

// Student Resources
router.get(
  "/student-resources",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentResources
);

// Student Messages
router.get(
  "/student-messages",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentMessages
);

// Student Settings
router.get(
  "/student-settings",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentSettings
);

module.exports = router;