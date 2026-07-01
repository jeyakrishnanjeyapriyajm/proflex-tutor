const User = require("../models/User");
const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const QuestionAttempt = require("../models/QuestionAttempt");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");

const isLecturerOrAdmin = (req) => {
  return req.user?.role === "instructor" || req.user?.role === "admin";
};

const round = (value, digits = 2) => {
  const number = Number(value) || 0;
  return Number(number.toFixed(digits));
};

const getLecturerOverview = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const [
      totalStudents,
      totalModules,
      totalQuestions,
      totalAttempts,
      completedProgress,
      stuckAttempts,
      qLearningDecisions,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      LearningModule.countDocuments({ isActive: true }),
      Question.countDocuments({ isActive: true }),
      QuestionAttempt.countDocuments({}),
      StudentModuleProgress.countDocuments({ status: "completed" }),
      QuestionAttempt.countDocuments({ isStuck: true }),
      DecisionLog.countDocuments({}),
    ]);

    const correctAttempts = await QuestionAttempt.countDocuments({
      isCorrect: true,
    });

    const overallAccuracy =
      totalAttempts > 0 ? round((correctAttempts / totalAttempts) * 100, 2) : 0;

    const recentAttempts = await QuestionAttempt.find({})
      .populate("student", "name email")
      .populate("question", "questionText concept difficulty orderNo")
      .populate("module", "title name")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const recentActivities = recentAttempts.map((attempt) => ({
      id: attempt._id,
      studentName:
        attempt.student?.name || attempt.student?.email || "Unknown Student",
      moduleName: attempt.module?.title || attempt.module?.name || "Module",
      concept: attempt.question?.concept || "Unknown Concept",
      difficulty: attempt.question?.difficulty || "unknown",
      isCorrect: Boolean(attempt.isCorrect),
      isStuck: Boolean(attempt.isStuck),
      createdAt: attempt.createdAt,
    }));

    const moduleProgress = await LearningModule.find({ isActive: true })
      .sort({ orderNo: 1 })
      .lean();

    const modules = await Promise.all(
      moduleProgress.map(async (module) => {
        const [questionCount, progressCount, completedCount, attemptCount] =
          await Promise.all([
            Question.countDocuments({
              module: module._id,
              isActive: true,
            }),
            StudentModuleProgress.countDocuments({
              module: module._id,
            }),
            StudentModuleProgress.countDocuments({
              module: module._id,
              status: "completed",
            }),
            QuestionAttempt.countDocuments({
              module: module._id,
            }),
          ]);

        return {
          moduleId: module._id,
          moduleName: module.title || module.name,
          moduleCode: module.code || "",
          orderNo: module.orderNo || 0,
          questionCount,
          studentCount: progressCount,
          completedCount,
          attemptCount,
          completionRate:
            progressCount > 0
              ? round((completedCount / progressCount) * 100, 2)
              : 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      overview: {
        totalStudents,
        totalModules,
        totalQuestions,
        totalAttempts,
        correctAttempts,
        overallAccuracy,
        completedProgress,
        stuckAttempts,
        qLearningDecisions,
        recentActivities,
        modules,
      },
    });
  } catch (error) {
    console.error("LECTURER OVERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load lecturer overview",
      error: error.message,
    });
  }
};

const getLecturerStudents = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const students = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      students.map(async (student) => {
        const [progressRecords, attempts] = await Promise.all([
          StudentModuleProgress.find({ student: student._id }).lean(),
          QuestionAttempt.find({ student: student._id }).lean(),
        ]);

        const completedModules = progressRecords.filter(
          (item) => item.status === "completed"
        ).length;

        const totalAttempts = attempts.length;
        const correctAttempts = attempts.filter((item) => item.isCorrect).length;
        const stuckEvents = attempts.filter((item) => item.isStuck).length;

        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          isActive: student.isActive,
          createdAt: student.createdAt,
          completedModules,
          totalAttempts,
          correctAttempts,
          stuckEvents,
          accuracy:
            totalAttempts > 0
              ? round((correctAttempts / totalAttempts) * 100, 2)
              : 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      students: result,
    });
  } catch (error) {
    console.error("LECTURER STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load lecturer students",
      error: error.message,
    });
  }
};

const getLecturerAnalytics = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const modules = await LearningModule.find({ isActive: true })
      .sort({ orderNo: 1 })
      .lean();

    const moduleAnalytics = await Promise.all(
      modules.map(async (module) => {
        const attempts = await QuestionAttempt.find({ module: module._id }).lean();

        const totalAttempts = attempts.length;
        const correctAttempts = attempts.filter((item) => item.isCorrect).length;
        const wrongAttempts = totalAttempts - correctAttempts;
        const stuckEvents = attempts.filter((item) => item.isStuck).length;

        const progressCount = await StudentModuleProgress.countDocuments({
          module: module._id,
        });

        const completedCount = await StudentModuleProgress.countDocuments({
          module: module._id,
          status: "completed",
        });

        return {
          moduleId: module._id,
          moduleName: module.title || module.name,
          totalAttempts,
          correctAttempts,
          wrongAttempts,
          stuckEvents,
          accuracy:
            totalAttempts > 0
              ? round((correctAttempts / totalAttempts) * 100, 2)
              : 0,
          studentCount: progressCount,
          completedCount,
          completionRate:
            progressCount > 0
              ? round((completedCount / progressCount) * 100, 2)
              : 0,
        };
      })
    );

    const conceptRecords = await StudentConceptMastery.find({}).lean();

    const conceptMap = new Map();

    conceptRecords.forEach((record) => {
      const concept = record.concept || "Unknown";
      const value =
        Number(record.masteryProbability) || Number(record.masteryScore) || 0;

      if (!conceptMap.has(concept)) {
        conceptMap.set(concept, []);
      }

      conceptMap.get(concept).push(value);
    });

    const conceptMastery = Array.from(conceptMap.entries()).map(
      ([concept, values]) => {
        const average =
          values.length > 0
            ? values.reduce((sum, value) => sum + value, 0) / values.length
            : 0;

        return {
          concept,
          averageMastery: round(average, 4),
          averageMasteryPercentage: round(average * 100, 2),
          studentCount: values.length,
          level:
            average >= 0.7 ? "high" : average >= 0.4 ? "medium" : "low",
        };
      }
    );

    const qActions = await DecisionLog.aggregate([
      {
        $group: {
          _id: {
            $ifNull: ["$qAction", "$recommendedSupportAction"],
          },
          count: { $sum: 1 },
          totalReward: { $sum: { $ifNull: ["$reward", 0] } },
        },
      },
      {
        $project: {
          action: "$_id",
          count: 1,
          totalReward: 1,
          averageReward: {
            $cond: [
              { $gt: ["$count", 0] },
              { $divide: ["$totalReward", "$count"] },
              0,
            ],
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      analytics: {
        moduleAnalytics,
        conceptMastery,
        qActions: qActions.map((item) => ({
          action: item.action || "unknown",
          count: item.count,
          totalReward: round(item.totalReward, 2),
          averageReward: round(item.averageReward, 2),
        })),
      },
    });
  } catch (error) {
    console.error("LECTURER ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load lecturer analytics",
      error: error.message,
    });
  }
};

const getLecturerContent = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const modules = await LearningModule.find({})
      .sort({ orderNo: 1 })
      .lean();

    const result = await Promise.all(
      modules.map(async (module) => {
        const questionCount = await Question.countDocuments({
          module: module._id,
        });

        return {
          ...module,
          questionCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: result.length,
      modules: result,
    });
  } catch (error) {
    console.error("LECTURER CONTENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load lecturer content",
      error: error.message,
    });
  }
};

const getLecturerQuestionBank = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const { moduleId, difficulty, search } = req.query;

    const filter = {};

    if (moduleId && moduleId !== "all") {
      filter.module = moduleId;
    }

    if (difficulty && difficulty !== "all") {
      filter.difficulty = difficulty;
    }

    if (search) {
      filter.$or = [
        { questionText: { $regex: search, $options: "i" } },
        { concept: { $regex: search, $options: "i" } },
      ];
    }

    const questions = await Question.find(filter)
      .populate("module", "title name code")
      .sort({ orderNo: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("LECTURER QUESTION BANK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load question bank",
      error: error.message,
    });
  }
};
const createLecturerQuestion = async (req, res) => {
  try {
    if (!isLecturerOrAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Lecturer only.",
      });
    }

    const {
      module,
      concept,
      difficulty,
      orderNo,
      questionText,
      codeSnippet,
      options,
      correctAnswer,
      hint,
      detailedHint,
      explanation,
    } = req.body;

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module is required",
      });
    }

    if (!concept || !difficulty || !orderNo || !questionText || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message:
          "Concept, difficulty, order number, question text, and correct answer are required",
      });
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty level",
      });
    }

    if (!["A", "B", "C", "D"].includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: "Correct answer must be A, B, C, or D",
      });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Each question must have exactly 4 options",
      });
    }

    const optionLabels = options.map((option) => option.label);

    const hasAllLabels = ["A", "B", "C", "D"].every((label) =>
      optionLabels.includes(label)
    );

    if (!hasAllLabels) {
      return res.status(400).json({
        success: false,
        message: "Options must include A, B, C, and D",
      });
    }

    const hasEmptyOption = options.some(
      (option) => !option.text || option.text.trim() === ""
    );

    if (hasEmptyOption) {
      return res.status(400).json({
        success: false,
        message: "All option text fields are required",
      });
    }

    const moduleExists = await LearningModule.findById(module);

    if (!moduleExists) {
      return res.status(404).json({
        success: false,
        message: "Learning module not found",
      });
    }

    const existingOrder = await Question.findOne({
      module,
      orderNo: Number(orderNo),
    });

    if (existingOrder) {
      return res.status(400).json({
        success: false,
        message:
          "A question with this order number already exists in this module",
      });
    }

    const expectedTimeMap = {
      easy: 45,
      medium: 90,
      hard: 150,
    };

    const question = await Question.create({
      module,
      concept: concept.trim(),
      difficulty,
      dynamicDifficulty: "not_enough_data",
      effectiveDifficulty: difficulty,
      difficultyScore: 0,
      difficultySource: "lecturer",
      minimumAttemptsForDynamicDifficulty: 20,
      difficultyStats: {
        expectedTimeSeconds: expectedTimeMap[difficulty],
      },
      orderNo: Number(orderNo),
      questionText: questionText.trim(),
      codeSnippet: codeSnippet || "",
      options: options.map((option) => ({
        label: option.label,
        text: option.text.trim(),
        misconceptionTag: option.misconceptionTag || "",
      })),
      correctAnswer,
      hint: hint || "",
      detailedHint: detailedHint || "",
      explanation: explanation || "",
      correctCount: 0,
      attemptCount: 0,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Question added to question bank successfully",
      question,
    });
  } catch (error) {
    console.error("CREATE LECTURER QUESTION ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate order number. This module already has a question with this order number.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add question",
      error: error.message,
    });
  }
};

module.exports = {
  getLecturerOverview,
  getLecturerStudents,
  getLecturerAnalytics,
  getLecturerContent,
  getLecturerQuestionBank,
  createLecturerQuestion,
};