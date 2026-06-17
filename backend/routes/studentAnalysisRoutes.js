const express = require("express");

const {
  getMyAnalysisOverview,
  getMyModuleAnalysis,
} = require("../controllers/studentAnalysisController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/overview", protect, getMyAnalysisOverview);
router.get("/modules/:moduleId", protect, getMyModuleAnalysis);

module.exports = router;