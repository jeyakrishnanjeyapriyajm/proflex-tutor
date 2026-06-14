const Question = require("../models/Question");
const {
  calculateQuestionDifficulty,
  recalculateAllQuestionDifficulties,
} = require("../services/questionDifficultyService");

const getQuestionDifficultySummary = async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments({ isActive: true });

    const lecturerDifficulty = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$difficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const dynamicDifficulty = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$dynamicDifficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const effectiveDifficulty = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$effectiveDifficulty",
          count: { $sum: 1 },
        },
      },
    ]);

    const topHardQuestions = await Question.find({
      isActive: true,
    })
      .sort({ difficultyScore: -1 })
      .limit(10)
      .select(
        "_id questionText concept difficulty dynamicDifficulty effectiveDifficulty difficultyScore difficultySource difficultyStats"
      );

    return res.status(200).json({
      success: true,
      totalQuestions,
      lecturerDifficulty,
      dynamicDifficulty,
      effectiveDifficulty,
      topHardQuestions,
    });
  } catch (error) {
    console.error("GET QUESTION DIFFICULTY SUMMARY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load question difficulty summary",
      error: error.message,
    });
  }
};

const recalculateQuestionDifficultyById = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await calculateQuestionDifficulty(questionId);

    return res.status(200).json({
      success: true,
      message: "Question difficulty recalculated",
      question,
    });
  } catch (error) {
    console.error("RECALCULATE QUESTION DIFFICULTY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to recalculate question difficulty",
      error: error.message,
    });
  }
};

const recalculateAllQuestionDifficulty = async (req, res) => {
  try {
    const results = await recalculateAllQuestionDifficulties();

    return res.status(200).json({
      success: true,
      message: "All question difficulties recalculated",
      total: results.length,
      results,
    });
  } catch (error) {
    console.error("RECALCULATE ALL QUESTION DIFFICULTY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to recalculate all question difficulties",
      error: error.message,
    });
  }
};

module.exports = {
  getQuestionDifficultySummary,
  recalculateQuestionDifficultyById,
  recalculateAllQuestionDifficulty,
};