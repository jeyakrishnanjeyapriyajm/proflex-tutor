const express = require("express");
const {
  runDifficultyAnalysis,
  submitDecisionReward,
  getMyConceptMastery,
} = require("../controllers/difficultyController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/analyze", protect, runDifficultyAnalysis);
router.post("/reward", protect, submitDecisionReward);
router.get("/my-mastery", protect, getMyConceptMastery);

module.exports = router;