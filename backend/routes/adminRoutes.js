const express = require("express");

const {
  getPendingInstructors,
  approveInstructor,
  rejectInstructor,
} = require("../controllers/admincontroller");

const { protect } = require("../middlewares/authmiddleware");
const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

router.get(
  "/pending-instructors",
  protect,
  authorizeRoles("admin"),
  getPendingInstructors
);

router.put(
  "/approve-instructor/:userId",
  protect,
  authorizeRoles("admin"),
  approveInstructor
);

router.put(
  "/reject-instructor/:userId",
  protect,
  authorizeRoles("admin"),
  rejectInstructor
);

module.exports = router;