const express = require("express");

const { getStudentDashboard } = require("../controllers/usercontroller");

const { protect } = require("../middlewares/authmiddleware");
const { authorizeRoles } = require("../middlewares/rolemiddleware");

const router = express.Router();

router.get(
  "/student-dashboard",
  protect,
  authorizeRoles("user", "admin", "instructor"),
  getStudentDashboard
);

module.exports = router;