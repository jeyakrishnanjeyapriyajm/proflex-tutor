const mongoose = require("mongoose");

const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const QuestionAttempt = require("../models/QuestionAttempt");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

const round = (value, digits = 2) => {
  const number = Number(value) || 0;
  return Number(number.toFixed(digits));
};

const getDifficultyLevelFromIndex = (difficultyIndex) => {
  const value = Number(difficultyIndex) || 0;

  if (value >= 0.7) return "easy";
  if (value >= 0.4) return "medium";
  return "hard";
};

const getMasteryLevel = (value) => {
  const score = Number(value) || 0;

  if (score < 0.4) return "low";
  if (score < 0.7) return "medium";
  return "high";
};

const getMyAnalysisOverview = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const modules = await LearningModule.find({ isActive: true })
      .sort({ orderNo: 1 })
      .lean();

    const overview = await Promise.all(
      modules.map(async (module) => {
        const [questionCount, progress, attemptCount] = await Promise.all([
          Question.countDocuments({
            module: module._id,
            isActive: true,
          }),

          StudentModuleProgress.findOne({
            student: studentId,
            module: module._id,
          }).lean(),

          QuestionAttempt.countDocuments({
            student: studentId,
            module: module._id,
          }),
        ]);

        return {
          moduleId: module._id,
          moduleName: module.name || module.title,
          moduleCode: module.code || "",
          orderNo: module.orderNo || 0,
          questionCount,
          attemptCount,
          status: progress?.status || "not_started",
          score: progress?.score || 0,
          completedCount: progress?.completedCount || 0,
          totalQuestions: progress?.totalQuestions || questionCount,
          percentage: progress?.percentage || 0,
          masteryLevel: progress?.overallMasteryLevel || "low",
        };
      })
    );

    return res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    console.error("GET MY ANALYSIS OVERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student analysis overview",
      error: error.message,
    });
  }
};

const getMyModuleAnalysis = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { moduleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moduleId",
      });
    }

    const module = await LearningModule.findById(moduleId).lean();

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const questions = await Question.find({
      module: moduleId,
      isActive: true,
    })
      .sort({ orderNo: 1 })
      .lean();

    const attempts = await QuestionAttempt.find({
      student: studentId,
      module: moduleId,
    })
      .populate("question", "questionText concept difficulty orderNo")
      .sort({ createdAt: 1 })
      .lean();

    const progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    }).lean();

    const decisionLogs = await DecisionLog.find({
      student: studentId,
      module: moduleId,
    })
      .populate("question", "questionText concept difficulty orderNo")
      .sort({ createdAt: 1 })
      .lean();

    const moduleConcepts = [
      ...new Set(questions.map((question) => question.concept).filter(Boolean)),
    ];

    const conceptMasteryRecords = await StudentConceptMastery.find({
      student: studentId,
      concept: {
        $in: moduleConcepts,
      },
    }).lean();

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((attempt) => attempt.isCorrect).length;
    const wrongAttempts = totalAttempts - correctAttempts;
    const hintUsedCount = attempts.filter((attempt) => attempt.hintUsed).length;
    const stuckEvents = attempts.filter((attempt) => attempt.isStuck).length;

    const totalTimeSeconds = attempts.reduce(
      (sum, attempt) => sum + (Number(attempt.timeTakenSeconds) || 0),
      0
    );

    const averageTimeSeconds =
      totalAttempts > 0 ? round(totalTimeSeconds / totalAttempts, 2) : 0;

    const accuracyPercentage =
      totalAttempts > 0 ? round((correctAttempts / totalAttempts) * 100, 2) : 0;

    const moduleSummary = {
      moduleId: module._id,
      moduleName: module.name || module.title,
      moduleCode: module.code || "",
      totalQuestions: questions.length,
      totalAttempts,
      correctAttempts,
      wrongAttempts,
      hintUsedCount,
      stuckEvents,
      totalTimeSeconds,
      averageTimeSeconds,
      accuracyPercentage,

      status: progress?.status || "not_started",
      score: progress?.score || 0,
      completedCount: progress?.completedCount || 0,
      totalModuleQuestions: progress?.totalQuestions || questions.length,
      percentage: progress?.percentage || 0,
      overallMasteryScore: progress?.overallMasteryScore || 0,
      overallMasteryLevel: progress?.overallMasteryLevel || "low",
    };

    const questionPerformance = questions.map((question) => {
      const questionAttempts = attempts.filter(
        (attempt) =>
          String(attempt.question?._id || attempt.question) === String(question._id)
      );

      const qTotal = questionAttempts.length;
      const qCorrect = questionAttempts.filter((attempt) => attempt.isCorrect).length;
      const qWrong = qTotal - qCorrect;
      const qHints = questionAttempts.filter((attempt) => attempt.hintUsed).length;
      const qStuck = questionAttempts.filter((attempt) => attempt.isStuck).length;

      const qTime = questionAttempts.reduce(
        (sum, attempt) => sum + (Number(attempt.timeTakenSeconds) || 0),
        0
      );

      const difficultyIndex = qTotal > 0 ? qCorrect / qTotal : 0;

      return {
        questionId: question._id,
        orderNo: question.orderNo,
        questionText: question.questionText,
        concept: question.concept,
        lecturerDifficulty: question.difficulty,
        totalAttempts: qTotal,
        correctAttempts: qCorrect,
        wrongAttempts: qWrong,
        hintUsedCount: qHints,
        stuckEvents: qStuck,
        averageTimeSeconds: qTotal > 0 ? round(qTime / qTotal, 2) : 0,
        accuracyPercentage: qTotal > 0 ? round((qCorrect / qTotal) * 100, 2) : 0,
        difficultyIndex: round(difficultyIndex, 2),
        dynamicLevel: getDifficultyLevelFromIndex(difficultyIndex),
        lastResult:
          questionAttempts.length > 0
            ? questionAttempts[questionAttempts.length - 1].isCorrect
              ? "correct"
              : "wrong"
            : "not_attempted",
      };
    });

    const conceptMap = new Map();

    attempts.forEach((attempt) => {
      const concept = attempt.question?.concept || "Unknown";

      if (!conceptMap.has(concept)) {
        conceptMap.set(concept, {
          concept,
          attempts: 0,
          correct: 0,
          wrong: 0,
          hints: 0,
          stuck: 0,
          masteryValues: [],
        });
      }

      const item = conceptMap.get(concept);

      item.attempts += 1;

      if (attempt.isCorrect) item.correct += 1;
      else item.wrong += 1;

      if (attempt.hintUsed) item.hints += 1;
      if (attempt.isStuck) item.stuck += 1;
    });

    decisionLogs.forEach((log) => {
      const concept = log.concept || "Unknown";

      if (!conceptMap.has(concept)) {
        conceptMap.set(concept, {
          concept,
          attempts: 0,
          correct: 0,
          wrong: 0,
          hints: 0,
          stuck: 0,
          masteryValues: [],
        });
      }

      conceptMap
        .get(concept)
        .masteryValues.push(Number(log.finalMasteryProbability) || 0);
    });

    conceptMasteryRecords.forEach((record) => {
      const concept = record.concept || "Unknown";

      if (!conceptMap.has(concept)) {
        conceptMap.set(concept, {
          concept,
          attempts: 0,
          correct: 0,
          wrong: 0,
          hints: 0,
          stuck: 0,
          masteryValues: [],
        });
      }

      conceptMap
        .get(concept)
        .masteryValues.push(
          Number(record.masteryProbability) ||
            Number(record.masteryScore) ||
            0
        );
    });

    const conceptMastery = Array.from(conceptMap.values()).map((item) => {
      const averageMastery =
        item.masteryValues.length > 0
          ? item.masteryValues.reduce((sum, value) => sum + value, 0) /
            item.masteryValues.length
          : item.attempts > 0
            ? item.correct / item.attempts
            : 0;

      return {
        concept: item.concept,
        attempts: item.attempts,
        correct: item.correct,
        wrong: item.wrong,
        hints: item.hints,
        stuck: item.stuck,
        accuracyPercentage:
          item.attempts > 0 ? round((item.correct / item.attempts) * 100, 2) : 0,
        averageMastery: round(averageMastery, 4),
        averageMasteryPercentage: round(averageMastery * 100, 2),
        masteryLevel: getMasteryLevel(averageMastery),
      };
    });

    const bktValues = decisionLogs
      .map((log) => ({
        concept: log.concept,
        bktMasteryProbability: Number(log.bktMasteryProbability) || 0,
        finalMasteryProbability: Number(log.finalMasteryProbability) || 0,
        masteryLevel: log.masteryLevel || "unknown",
        createdAt: log.createdAt,
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    const initialMastery = bktValues[0]?.finalMasteryProbability || 0;
    const finalMastery =
      bktValues[bktValues.length - 1]?.finalMasteryProbability || 0;

    const bktSummary = {
      initialMastery: round(initialMastery, 4),
      finalMastery: round(finalMastery, 4),
      improvement: round(finalMastery - initialMastery, 4),
      progression: bktValues.map((item, index) => ({
        step: index + 1,
        concept: item.concept,
        mastery: round(item.finalMasteryProbability, 4),
        masteryPercentage: round(item.finalMasteryProbability * 100, 2),
        masteryLevel: item.masteryLevel,
      })),
    };

    const qActionMap = new Map();

    decisionLogs.forEach((log) => {
      const action = log.qAction || log.recommendedSupportAction || "unknown";

      if (!qActionMap.has(action)) {
        qActionMap.set(action, {
          action,
          count: 0,
          totalReward: 0,
          averageReward: 0,
        });
      }

      const item = qActionMap.get(action);

      item.count += 1;
      item.totalReward += Number(log.reward) || 0;
    });

    const qLearningActions = Array.from(qActionMap.values()).map((item) => ({
      action: item.action,
      count: item.count,
      totalReward: round(item.totalReward, 2),
      averageReward:
        item.count > 0 ? round(item.totalReward / item.count, 2) : 0,
    }));

    const recentAttempts = attempts
      .slice(-10)
      .reverse()
      .map((attempt) => ({
        attemptId: attempt._id,
        questionNo: attempt.question?.orderNo,
        concept: attempt.question?.concept || "Unknown",
        difficulty: attempt.question?.difficulty || "unknown",
        selectedAnswer: attempt.selectedAnswer,
        isCorrect: attempt.isCorrect,
        attemptNo: attempt.attemptNo,
        timeTakenSeconds: attempt.timeTakenSeconds || 0,
        hintUsed: attempt.hintUsed,
        isStuck: attempt.isStuck,
        misconceptionTag: attempt.misconceptionTag || "unknown",
        createdAt: attempt.createdAt,
      }));

    const aiInsights = [];

    if (accuracyPercentage >= 70) {
      aiInsights.push({
        type: "success",
        title: "Good Accuracy",
        description: `Your accuracy in this module is ${accuracyPercentage}%. You are progressing well.`,
      });
    } else if (totalAttempts > 0) {
      aiInsights.push({
        type: "warning",
        title: "Accuracy Needs Improvement",
        description: `Your accuracy is ${accuracyPercentage}%. Review weak concepts and retry practice tasks.`,
      });
    }

    const weakestConcept = [...conceptMastery].sort(
      (a, b) => a.averageMastery - b.averageMastery
    )[0];

    if (weakestConcept) {
      aiInsights.push({
        type: "info",
        title: "Weakest Concept",
        description: `${weakestConcept.concept} has the lowest mastery score (${weakestConcept.averageMasteryPercentage}%). Focus more on this concept.`,
      });
    }

    if (stuckEvents > 0) {
      aiInsights.push({
        type: "warning",
        title: "Stuck Events Detected",
        description: `You were detected as stuck ${stuckEvents} time(s). The system used adaptive support to help you continue.`,
      });
    }

    return res.status(200).json({
      success: true,
      moduleSummary,
      questionPerformance,
      conceptMastery,
      bktSummary,
      qLearningActions,
      recentAttempts,
      aiInsights,
    });
  } catch (error) {
    console.error("GET MY MODULE ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student module analysis",
      error: error.message,
    });
  }
};

module.exports = {
  getMyAnalysisOverview,
  getMyModuleAnalysis,
};