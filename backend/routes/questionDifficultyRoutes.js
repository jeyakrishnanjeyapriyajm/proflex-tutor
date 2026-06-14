const express = require("express");
const {
  getQuestionDifficultySummary,
  recalculateQuestionDifficultyById,
  recalculateAllQuestionDifficulty,
} = require("../controllers/questionDifficultyController");

const { protect } = require("../middlewares/authmiddleware");
const { adminOnly } = require("../middlewares/rolemiddleware");

const router = express.Router();

router.get("/summary", protect, adminOnly, getQuestionDifficultySummary);
router.patch(
  "/:questionId/recalculate",
  protect,
  adminOnly,
  recalculateQuestionDifficultyById
);
router.patch("/recalculate-all/run", protect, adminOnly, recalculateAllQuestionDifficulty);

module.exports = router;