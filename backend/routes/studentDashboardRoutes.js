const express = require("express");

const {
  getStudentDashboardSummary,
} = require("../controllers/studentDashboardController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/summary", protect, getStudentDashboardSummary);

module.exports = router;