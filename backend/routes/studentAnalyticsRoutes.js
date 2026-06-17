const express = require("express");
const { getStudentAnalytics } = require("../controllers/studentAnalyticsController");
const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/", protect, getStudentAnalytics);

module.exports = router;