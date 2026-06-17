const StudentModuleProgress = require("../models/StudentModuleProgress");
const StudentConceptMastery = require("../models/StudentConceptMastery");

const safeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const clampPercent = (value) => {
  const number = safeNumber(value, 0);
  if (number < 0) return 0;
  if (number > 100) return 100;
  return Math.round(number);
};

const toPercent = (value) => {
  return clampPercent(safeNumber(value, 0) * 100);
};

const calculateAccuracy = (correct, wrong) => {
  const correctCount = safeNumber(correct, 0);
  const wrongCount = safeNumber(wrong, 0);
  const total = correctCount + wrongCount;

  if (total <= 0) return 0;

  return clampPercent((correctCount / total) * 100);
};

const formatStudyTime = (seconds = 0) => {
  const totalSeconds = safeNumber(seconds, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
};

const getModuleName = (module) => {
  if (!module) return "Unknown Module";
  return module.name || module.title || module.code || "Unknown Module";
};

const getCurrentLevel = (overallMastery) => {
  if (overallMastery >= 80) return "Advanced";
  if (overallMastery >= 50) return "Intermediate";
  return "Beginner";
};

const masteryLevelToStatus = (level) => {
  if (level === "high") return "mastered";
  if (level === "medium") return "good";
  return "needs-practice";
};

const getReadableStatus = (status) => {
  if (status === "completed") return "Completed";
  if (status === "needs_review") return "Needs Review";
  if (status === "recovery") return "Recovery";
  if (status === "stuck") return "Stuck";
  if (status === "in_progress") return "In Progress";
  return "Not Started";
};

const buildWeeklyActivity = (progresses) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  const weekly = [];

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    weekly.push({
      day: days[date.getDay()],
      dateKey: date.toISOString().slice(0, 10),
      minutes: 0,
      attempts: 0,
    });
  }

  progresses.forEach((progress) => {
    const activityDate = progress.lastActivityAt || progress.updatedAt;
    if (!activityDate) return;

    const dateKey = new Date(activityDate).toISOString().slice(0, 10);
    const item = weekly.find((day) => day.dateKey === dateKey);

    if (!item) return;

    const attempts =
      safeNumber(progress.correctCount) +
      safeNumber(progress.wrongCount) +
      safeNumber(progress.skippedCount);

    item.attempts += attempts;
    item.minutes += Math.round(safeNumber(progress.totalTimeSpentSeconds) / 60);
  });

  return weekly.map(({ day, minutes, attempts }) => ({
    day,
    minutes,
    attempts,
  }));
};

const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Student user not found.",
      });
    }

    const progresses = await StudentModuleProgress.find({
      student: studentId,
    })
      .populate("module", "name title code description orderNo totalQuestions")
      .populate("completedQuestionIds", "difficulty concept")
      .populate("wrongQuestionIds", "difficulty concept")
      .sort({ updatedAt: -1 });

    const conceptMasteryRecords = await StudentConceptMastery.find({
      student: studentId,
    }).sort({ masteryProbability: -1 });

    const completedModules = progresses.filter(
      (progress) => progress.status === "completed"
    ).length;

    const startedModules = progresses.length;

    const totalCorrect = progresses.reduce(
      (sum, item) => sum + safeNumber(item.correctCount),
      0
    );

    const totalWrong = progresses.reduce(
      (sum, item) => sum + safeNumber(item.wrongCount),
      0
    );

    const totalSkipped = progresses.reduce(
      (sum, item) => sum + safeNumber(item.skippedCount),
      0
    );

    const totalAttempts = totalCorrect + totalWrong + totalSkipped;

    const totalTimeSpentSeconds = progresses.reduce(
      (sum, item) => sum + safeNumber(item.totalTimeSpentSeconds),
      0
    );

    const accuracy = calculateAccuracy(totalCorrect, totalWrong);

    let overallMastery = 0;

    if (conceptMasteryRecords.length > 0) {
      const totalMastery = conceptMasteryRecords.reduce(
        (sum, item) => sum + safeNumber(item.masteryProbability),
        0
      );

      overallMastery = toPercent(totalMastery / conceptMasteryRecords.length);
    } else if (progresses.length > 0) {
      const totalProgressMastery = progresses.reduce(
        (sum, item) => sum + safeNumber(item.overallMasteryScore),
        0
      );

      overallMastery = toPercent(totalProgressMastery / progresses.length);
    }

    const conceptMastery = conceptMasteryRecords.map((item) => ({
      concept: item.concept,
      mastery: toPercent(item.masteryProbability),
      masteryLevel: item.masteryLevel,
      status: masteryLevelToStatus(item.masteryLevel),
      attempts: safeNumber(item.totalAttempts),
      accuracy: calculateAccuracy(item.correctAttempts, item.wrongAttempts),
      correctAttempts: safeNumber(item.correctAttempts),
      wrongAttempts: safeNumber(item.wrongAttempts),
      hintUsedCount: safeNumber(item.hintUsedCount),
      stuckCount: safeNumber(item.stuckCount),
      averageTimeSeconds: safeNumber(item.averageTimeSeconds),
      lastSupportAction: item.lastSupportAction || "",
      lastRecommendedDifficulty: item.lastRecommendedDifficulty || "",
    }));

    const moduleProgress = progresses.map((item) => {
      const totalQuestions =
        safeNumber(item.totalQuestions) ||
        safeNumber(item.module?.totalQuestions) ||
        safeNumber(item.mainQuestionSequence?.length) ||
        10;

      const completedCount = safeNumber(item.completedCount);

      const progressPercentage =
        totalQuestions > 0
          ? clampPercent((completedCount / totalQuestions) * 100)
          : 0;

      return {
        id: item._id,
        moduleId: item.module?._id || null,
        module: getModuleName(item.module),
        moduleCode: item.module?.code || "",
        status: item.status,
        readableStatus: getReadableStatus(item.status),
        completedCount,
        totalQuestions,
        progressPercentage,
        correctCount: safeNumber(item.correctCount),
        wrongCount: safeNumber(item.wrongCount),
        skippedCount: safeNumber(item.skippedCount),
        score: safeNumber(item.score),
        percentage: clampPercent(item.percentage),
        accuracy: calculateAccuracy(item.correctCount, item.wrongCount),
        overallMastery: toPercent(item.overallMasteryScore),
        overallMasteryLevel: item.overallMasteryLevel,
        studyTime: formatStudyTime(item.totalTimeSpentSeconds),
        startedAt: item.startedAt,
        completedAt: item.completedAt,
        updatedAt: item.updatedAt,
      };
    });

    const recentAttempts = moduleProgress.slice(0, 8).map((item) => ({
      id: item.id,
      module: item.module,
      difficulty: "Mixed",
      score: `${item.correctCount}/${item.totalQuestions}`,
      accuracy: item.accuracy,
      time: item.studyTime,
      status: item.readableStatus,
    }));

    const difficultyMap = {
      easy: {
        level: "Easy",
        correct: 0,
        wrong: 0,
      },
      medium: {
        level: "Medium",
        correct: 0,
        wrong: 0,
      },
      hard: {
        level: "Hard",
        correct: 0,
        wrong: 0,
      },
    };

    progresses.forEach((progress) => {
      if (Array.isArray(progress.completedQuestionIds)) {
        progress.completedQuestionIds.forEach((question) => {
          const difficulty = question?.difficulty;

          if (difficultyMap[difficulty]) {
            difficultyMap[difficulty].correct += 1;
          }
        });
      }

      if (Array.isArray(progress.wrongQuestionIds)) {
        progress.wrongQuestionIds.forEach((question) => {
          const difficulty = question?.difficulty;

          if (difficultyMap[difficulty]) {
            difficultyMap[difficulty].wrong += 1;
          }
        });
      }
    });

    const difficultyPerformance = Object.values(difficultyMap).map((item) => ({
      ...item,
      accuracy: calculateAccuracy(item.correct, item.wrong),
    }));

    const weakestConcept = [...conceptMastery].sort(
      (a, b) => a.mastery - b.mastery
    )[0];

    const strongestConcept = [...conceptMastery].sort(
      (a, b) => b.mastery - a.mastery
    )[0];

    const aiInsights = [];

    if (strongestConcept) {
      aiInsights.push({
        type: "success",
        title: "Strong Concept",
        description: `You are strongest in ${strongestConcept.concept} with ${strongestConcept.mastery}% mastery.`,
      });
    }

    if (weakestConcept) {
      aiInsights.push({
        type: "warning",
        title: "Needs More Practice",
        description: `Focus more on ${weakestConcept.concept}. Your current mastery is ${weakestConcept.mastery}%.`,
      });
    }

    aiInsights.push({
      type: "info",
      title: "Recommended Plan",
      description:
        overallMastery < 50
          ? "Revise weak concepts, complete recovery tasks, and retry module questions after review."
          : "Continue with similar and harder challenges to improve your C programming mastery.",
    });

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          overallMastery,
          accuracy,
          completedModules,
          totalModules: startedModules,
          startedModules,
          studyTime: formatStudyTime(totalTimeSpentSeconds),
          totalAttempts,
          totalCorrect,
          totalWrong,
          totalSkipped,
          currentLevel: getCurrentLevel(overallMastery),
          streak: 0,
        },
        conceptMastery,
        moduleProgress,
        weeklyActivity: buildWeeklyActivity(progresses),
        recentAttempts,
        difficultyPerformance,
        aiInsights,
      },
    });
  } catch (error) {
    console.error("GET STUDENT ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentAnalytics,
};