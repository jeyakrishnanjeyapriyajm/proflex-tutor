const express = require("express");

const {
  getLecturerOverview,
  getLecturerStudents,
  getLecturerAnalytics,
  getLecturerContent,
  getLecturerQuestionBank,
  createLecturerQuestion,
} = require("../controllers/lecturerController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/overview", protect, getLecturerOverview);
router.get("/students", protect, getLecturerStudents);
router.get("/analytics", protect, getLecturerAnalytics);
router.get("/content", protect, getLecturerContent);
router.get("/question-bank", protect, getLecturerQuestionBank);
router.post("/question-bank", protect, createLecturerQuestion);

module.exports = router;