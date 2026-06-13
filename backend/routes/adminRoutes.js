const express = require("express");

const {
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
} = require("../controllers/admincontroller");

const { protect } = require("../middlewares/authmiddleware");
const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

// All admin routes need login + admin role
router.use(protect);
router.use(authorizeRoles("admin"));

// Overview
router.get("/overview", getAdminOverview);

// Users
router.get("/users", getAdminUsers);
router.get("/users/:userId", getAdminUserById);
router.patch("/users/:userId/activate", activateUser);
router.patch("/users/:userId/deactivate", deactivateUser);
router.patch("/users/:userId/change-role", changeUserRole);

// Instructor routes - frontend current routes
router.get("/pending-instructors", getPendingInstructors);
router.put("/approve-instructor/:userId", approveInstructor);
router.put("/reject-instructor/:userId", rejectInstructor);

// Instructor routes - better REST routes for later
router.get("/instructors/pending", getPendingInstructors);
router.get("/instructors/approved", getApprovedInstructors);
router.get("/instructors/rejected", getRejectedInstructors);
router.patch("/instructors/:userId/approve", approveInstructor);
router.patch("/instructors/:userId/reject", rejectInstructor);

module.exports = router;