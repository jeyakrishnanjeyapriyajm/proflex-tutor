const express = require("express");
const {
  getLearningModules,
  startModule,
  getCurrentTask,
  submitTaskAnswer,
  handleSuggestedRoundResult,
  retryModuleAssessment,
} = require("../controllers/taskGivingController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/modules", protect, getLearningModules);
router.post("/modules/:moduleId/start", protect, startModule);
router.get("/modules/:moduleId/current-task", protect, getCurrentTask);
router.post("/submit", protect, submitTaskAnswer);
router.post("/suggested-round-result", protect, handleSuggestedRoundResult);
router.post("/:moduleId/retry-assessment", protect, retryModuleAssessment);

module.exports = router;