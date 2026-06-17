const express = require("express");

const {
  getAnalysisOverview,
  getModuleAnalysis,
} = require("../controllers/analysisController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/overview", protect, getAnalysisOverview);
router.get("/modules/:moduleId", protect, getModuleAnalysis);

module.exports = router;