const LearningModule = require("../models/LearningModule");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

const getDateKey = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const calculateActiveStreak = (attempts) => {
  const activeDays = new Set();

  attempts.forEach((attempt) => {
    if (attempt.createdAt) {
      activeDays.add(getDateKey(attempt.createdAt));
    }
  });

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i += 1) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const key = getDateKey(checkDate);

    if (activeDays.has(key)) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
};

const getStudentDashboardSummary = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const modules = await LearningModule.find({ isActive: true }).lean();

    const progressRecords = await StudentModuleProgress.find({
      student: studentId,
    }).lean();

    const attempts = await QuestionAttempt.find({
      student: studentId,
    }).lean();

    const totalModules = modules.length;

    const completedModules = progressRecords.filter(
      (item) => item.status === "completed"
    ).length;

    const completedMCQs = progressRecords.reduce(
      (sum, item) => sum + (Number(item.completedCount) || 0),
      0
    );

    const totalPossibleQuestions = progressRecords.reduce(
      (sum, item) => sum + (Number(item.totalQuestions) || 0),
      0
    );

    const completion =
      totalPossibleQuestions > 0
        ? Math.round((completedMCQs / totalPossibleQuestions) * 100)
        : totalModules > 0
          ? Math.round((completedModules / totalModules) * 100)
          : 0;

    const correctAttempts = attempts.filter((item) => item.isCorrect).length;

    const totalTimeSeconds = attempts.reduce(
      (sum, item) => sum + (Number(item.timeTakenSeconds) || 0),
      0
    );

    const timeSpentHours = Number((totalTimeSeconds / 3600).toFixed(1));

    const totalXP = correctAttempts * 10;

    const level = Math.max(1, Math.floor(totalXP / 100) + 1);

    const activeStreak = calculateActiveStreak(attempts);

    return res.status(200).json({
      success: true,
      dashboard: {
        completion,
        overallProgress: completion,
        level,
        completedModules,
        totalModules,
        completedMCQs,
        exercises: completedMCQs,
        timeSpent: `${timeSpentHours}h`,
        timeSpentHours,
        xp: totalXP,
        totalXP,
        streak: `${activeStreak} Days`,
        activeStreak,
        courseTitle: "C Programming Fundamentals",
      },
    });
  } catch (error) {
    console.error("GET STUDENT DASHBOARD SUMMARY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student dashboard summary",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboardSummary,
};