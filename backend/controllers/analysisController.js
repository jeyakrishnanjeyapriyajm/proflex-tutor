const mongoose = require("mongoose");

const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const QuestionAttempt = require("../models/QuestionAttempt");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");

const toObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
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

const getStudentKey = (student) => {
  if (!student) return "unknown";
  return String(student._id || student);
};

const getStudentName = (student) => {
  if (!student) return "Unknown Student";

  return (
    student.name ||
    student.fullName ||
    student.username ||
    student.email ||
    "Unknown Student"
  );
};

const getModuleAnalysis = async (req, res) => {
  try {
    const { moduleId } = req.params;

    const objectModuleId = toObjectId(moduleId);

    if (!objectModuleId) {
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
      module: moduleId,
    })
      .populate("student", "name fullName username email gender role")
      .populate("question", "questionText concept difficulty orderNo")
      .sort({ createdAt: 1 })
      .lean();

    const progressRecords = await StudentModuleProgress.find({
      module: moduleId,
    })
      .populate("student", "name fullName username email gender role")
      .lean();

    const decisionLogs = await DecisionLog.find({
      module: moduleId,
    })
      .populate("student", "name fullName username email gender role")
      .populate("question", "questionText concept difficulty orderNo")
      .sort({ createdAt: 1 })
      .lean();

    const studentIds = [
      ...new Set(
        [
          ...attempts.map((item) => getStudentKey(item.student)),
          ...progressRecords.map((item) => getStudentKey(item.student)),
          ...decisionLogs.map((item) => getStudentKey(item.student)),
        ].filter((id) => id && id !== "unknown")
      ),
    ];

    const moduleConcepts = [
      ...new Set(questions.map((question) => question.concept).filter(Boolean)),
    ];

    const conceptMasteryRecords = await StudentConceptMastery.find({
      student: {
        $in: studentIds
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id)),
      },
      concept: {
        $in: moduleConcepts,
      },
    })
      .populate("student", "name fullName username email gender role")
      .lean();

    // =====================================================
    // 1. Participant Distribution
    // =====================================================

    const studentMap = new Map();

    attempts.forEach((attempt) => {
      const key = getStudentKey(attempt.student);
      if (!studentMap.has(key)) {
        studentMap.set(key, attempt.student);
      }
    });

    progressRecords.forEach((progress) => {
      const key = getStudentKey(progress.student);
      if (!studentMap.has(key)) {
        studentMap.set(key, progress.student);
      }
    });

    decisionLogs.forEach((log) => {
      const key = getStudentKey(log.student);
      if (!studentMap.has(key)) {
        studentMap.set(key, log.student);
      }
    });

    const students = Array.from(studentMap.values()).filter(Boolean);

    const genderCounts = students.reduce((acc, student) => {
      const gender = student.gender || "Not specified";
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});

    const participantDistribution = {
      totalStudents: students.length,
      genderDistribution: Object.entries(genderCounts).map(([category, count]) => ({
        category,
        count,
        percentage:
          students.length > 0 ? round((count / students.length) * 100, 2) : 0,
      })),
    };

    // =====================================================
    // 2. Student Module Performance
    // =====================================================

    const studentPerformanceMap = new Map();

    students.forEach((student) => {
      const key = getStudentKey(student);

      studentPerformanceMap.set(key, {
        studentId: key,
        studentName: getStudentName(student),
        email: student.email || "",
        totalAttempts: 0,
        correctAttempts: 0,
        wrongAttempts: 0,
        hintUsedCount: 0,
        stuckEvents: 0,
        totalTimeSeconds: 0,
        averageTimeSeconds: 0,
        accuracyPercentage: 0,
        moduleStatus: "not_started",
        score: 0,
        completedCount: 0,
        totalQuestions: questions.length,
      });
    });

    attempts.forEach((attempt) => {
      const key = getStudentKey(attempt.student);

      if (!studentPerformanceMap.has(key)) {
        studentPerformanceMap.set(key, {
          studentId: key,
          studentName: getStudentName(attempt.student),
          email: attempt.student?.email || "",
          totalAttempts: 0,
          correctAttempts: 0,
          wrongAttempts: 0,
          hintUsedCount: 0,
          stuckEvents: 0,
          totalTimeSeconds: 0,
          averageTimeSeconds: 0,
          accuracyPercentage: 0,
          moduleStatus: "not_started",
          score: 0,
          completedCount: 0,
          totalQuestions: questions.length,
        });
      }

      const item = studentPerformanceMap.get(key);

      item.totalAttempts += 1;

      if (attempt.isCorrect) {
        item.correctAttempts += 1;
      } else {
        item.wrongAttempts += 1;
      }

      if (attempt.hintUsed) {
        item.hintUsedCount += 1;
      }

      if (attempt.isStuck) {
        item.stuckEvents += 1;
      }

      item.totalTimeSeconds += Number(attempt.timeTakenSeconds) || 0;
    });

    progressRecords.forEach((progress) => {
      const key = getStudentKey(progress.student);

      if (!studentPerformanceMap.has(key)) {
        studentPerformanceMap.set(key, {
          studentId: key,
          studentName: getStudentName(progress.student),
          email: progress.student?.email || "",
          totalAttempts: 0,
          correctAttempts: 0,
          wrongAttempts: 0,
          hintUsedCount: 0,
          stuckEvents: 0,
          totalTimeSeconds: 0,
          averageTimeSeconds: 0,
          accuracyPercentage: 0,
          moduleStatus: progress.status || "not_started",
          score: progress.score || 0,
          completedCount: progress.completedCount || 0,
          totalQuestions: progress.totalQuestions || questions.length,
        });
      }

      const item = studentPerformanceMap.get(key);

      item.moduleStatus = progress.status || item.moduleStatus;
      item.score = progress.score || 0;
      item.completedCount = progress.completedCount || 0;
      item.totalQuestions = progress.totalQuestions || questions.length;
    });

    const studentPerformance = Array.from(studentPerformanceMap.values()).map(
      (item) => {
        item.averageTimeSeconds =
          item.totalAttempts > 0
            ? round(item.totalTimeSeconds / item.totalAttempts, 2)
            : 0;

        item.accuracyPercentage =
          item.totalAttempts > 0
            ? round((item.correctAttempts / item.totalAttempts) * 100, 2)
            : 0;

        return item;
      }
    );

    // =====================================================
    // 3. Question Difficulty Index Analysis
    // =====================================================

    const questionDifficultyAnalysis = questions.map((question) => {
      const questionAttempts = attempts.filter(
        (attempt) => String(attempt.question?._id || attempt.question) === String(question._id)
      );

      const totalAttempted = questionAttempts.length;
      const correctStudents = questionAttempts.filter(
        (attempt) => attempt.isCorrect
      ).length;

      const difficultyIndex =
        totalAttempted > 0 ? correctStudents / totalAttempted : 0;

      const dynamicLevel = getDifficultyLevelFromIndex(difficultyIndex);

      return {
        questionId: question._id,
        orderNo: question.orderNo,
        concept: question.concept,
        lecturerDifficulty: question.difficulty,
        correctStudents,
        totalStudents: totalAttempted,
        difficultyIndex: round(difficultyIndex, 2),
        dynamicLevel,
        matchedLecturerLabel:
          String(question.difficulty).toLowerCase() === dynamicLevel,
        questionText: question.questionText,
      };
    });

    const difficultySummary = {
      easy: questionDifficultyAnalysis.filter(
        (item) => item.dynamicLevel === "easy"
      ).length,
      medium: questionDifficultyAnalysis.filter(
        (item) => item.dynamicLevel === "medium"
      ).length,
      hard: questionDifficultyAnalysis.filter(
        (item) => item.dynamicLevel === "hard"
      ).length,
      matchedLecturerCount: questionDifficultyAnalysis.filter(
        (item) => item.matchedLecturerLabel
      ).length,
      totalQuestions: questionDifficultyAnalysis.length,
    };

    difficultySummary.matchPercentage =
      difficultySummary.totalQuestions > 0
        ? round(
            (difficultySummary.matchedLecturerCount /
              difficultySummary.totalQuestions) *
              100,
            2
          )
        : 0;

    // =====================================================
    // 4. BKT Mastery Progression
    // =====================================================

    const masteryByStudent = new Map();

    decisionLogs.forEach((log) => {
      const key = getStudentKey(log.student);

      if (!masteryByStudent.has(key)) {
        masteryByStudent.set(key, {
          studentId: key,
          studentName: getStudentName(log.student),
          values: [],
        });
      }

      masteryByStudent.get(key).values.push({
        concept: log.concept,
        bktMasteryProbability: Number(log.bktMasteryProbability) || 0,
        finalMasteryProbability: Number(log.finalMasteryProbability) || 0,
        createdAt: log.createdAt,
      });
    });

    const bktMasteryProgression = Array.from(masteryByStudent.values()).map(
      (item) => {
        const values = item.values.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

        const initial = values[0]?.finalMasteryProbability || 0;
        const final = values[values.length - 1]?.finalMasteryProbability || 0;

        return {
          studentId: item.studentId,
          studentName: item.studentName,
          initialMastery: round(initial, 4),
          finalMastery: round(final, 4),
          improvement: round(final - initial, 4),
        };
      }
    );

    const averageInitialMastery =
      bktMasteryProgression.length > 0
        ? round(
            bktMasteryProgression.reduce(
              (sum, item) => sum + item.initialMastery,
              0
            ) / bktMasteryProgression.length,
            4
          )
        : 0;

    const averageFinalMastery =
      bktMasteryProgression.length > 0
        ? round(
            bktMasteryProgression.reduce(
              (sum, item) => sum + item.finalMastery,
              0
            ) / bktMasteryProgression.length,
            4
          )
        : 0;

    const bktSummary = {
      averageInitialMastery,
      averageFinalMastery,
      averageImprovement: round(averageFinalMastery - averageInitialMastery, 4),
    };

    // =====================================================
    // 5. Stuck Detection Evaluation
    // =====================================================

    const stuckByStudentMap = new Map();

    attempts.forEach((attempt) => {
      const key = getStudentKey(attempt.student);

      if (!stuckByStudentMap.has(key)) {
        stuckByStudentMap.set(key, {
          studentId: key,
          studentName: getStudentName(attempt.student),
          stuckEvents: 0,
        });
      }

      if (attempt.isStuck) {
        stuckByStudentMap.get(key).stuckEvents += 1;
      }
    });

    const stuckByStudent = Array.from(stuckByStudentMap.values());

    const totalStuckEvents = stuckByStudent.reduce(
      (sum, item) => sum + item.stuckEvents,
      0
    );

    const interventionsTriggered = decisionLogs.filter((log) => {
      const action = log.recommendedSupportAction || "";
      return (
        action &&
        !["continue_main_sequence", "retry_same_question"].includes(action)
      );
    }).length;

    const stuckSummary = {
      totalStuckEvents,
      averagePerStudent:
        stuckByStudent.length > 0
          ? round(totalStuckEvents / stuckByStudent.length, 2)
          : 0,
      interventionsTriggered,
    };

    // =====================================================
    // 6. Concept-Level Mastery
    // =====================================================

    const conceptMasteryMap = new Map();

    decisionLogs.forEach((log) => {
      const concept = log.concept || "Unknown";
      const value = Number(log.finalMasteryProbability) || 0;

      if (!conceptMasteryMap.has(concept)) {
        conceptMasteryMap.set(concept, []);
      }

      conceptMasteryMap.get(concept).push(value);
    });

    conceptMasteryRecords.forEach((record) => {
      const concept = record.concept || "Unknown";
      const value =
        Number(record.masteryProbability) ||
        Number(record.masteryScore) ||
        0;

      if (!conceptMasteryMap.has(concept)) {
        conceptMasteryMap.set(concept, []);
      }

      conceptMasteryMap.get(concept).push(value);
    });

    const conceptMastery = Array.from(conceptMasteryMap.entries()).map(
      ([concept, values]) => {
        const average =
          values.length > 0
            ? values.reduce((sum, value) => sum + value, 0) / values.length
            : 0;

        return {
          concept,
          averageMastery: round(average, 4),
          averageMasteryPercentage: round(average * 100, 2),
          masteryLevel: getMasteryLevel(average),
        };
      }
    );

    // =====================================================
    // 7. Q-Learning Decision Evaluation
    // =====================================================

    const qActionMap = new Map();

    decisionLogs.forEach((log) => {
      const action =
        log.qAction || log.recommendedSupportAction || "unknown_action";

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

    const qLearningActions = Array.from(qActionMap.values()).map((item) => {
      item.averageReward =
        item.count > 0 ? round(item.totalReward / item.count, 2) : 0;

      item.totalReward = round(item.totalReward, 2);

      return item;
    });

    const rewardTrend = decisionLogs.map((log, index) => ({
      episode: index + 1,
      action: log.qAction || log.recommendedSupportAction || "",
      reward: Number(log.reward) || 0,
      averageRewardUntilNow: round(
        decisionLogs
          .slice(0, index + 1)
          .reduce((sum, item) => sum + (Number(item.reward) || 0), 0) /
          (index + 1),
        2
      ),
    }));

    // =====================================================
    // 8. Overall Module Summary
    // =====================================================

    const totalAttempts = attempts.length;
    const totalCorrect = attempts.filter((attempt) => attempt.isCorrect).length;
    const totalWrong = totalAttempts - totalCorrect;

    const moduleSummary = {
      moduleId: module._id,
      moduleName: module.name || module.title,
      moduleCode: module.code || "",
      totalStudents: students.length,
      totalQuestions: questions.length,
      totalAttempts,
      totalCorrect,
      totalWrong,
      overallAccuracy:
        totalAttempts > 0 ? round((totalCorrect / totalAttempts) * 100, 2) : 0,
      completedStudents: progressRecords.filter(
        (progress) => progress.status === "completed"
      ).length,
      inProgressStudents: progressRecords.filter(
        (progress) => progress.status === "in_progress"
      ).length,
      recoveryStudents: progressRecords.filter(
        (progress) => progress.status === "recovery"
      ).length,
      needsReviewStudents: progressRecords.filter(
        (progress) => progress.status === "needs_review"
      ).length,
    };

    return res.status(200).json({
      success: true,
      moduleSummary,
      participantDistribution,
      studentPerformance,
      questionDifficultyAnalysis,
      difficultySummary,
      bktMasteryProgression,
      bktSummary,
      stuckByStudent,
      stuckSummary,
      conceptMastery,
      qLearningActions,
      rewardTrend,
      prePostTestAnalysis: {
        available: false,
        message:
          "Pre-test and post-test data are not stored in the current database. Add a separate EvaluationResult model if you want this section.",
      },
      susAnalysis: {
        available: false,
        message:
          "SUS data are not stored in the current database. Add a separate SUS model if you want this section.",
      },
    });
  } catch (error) {
    console.error("GET MODULE ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load module analysis",
      error: error.message,
    });
  }
};

const getAnalysisOverview = async (req, res) => {
  try {
    const modules = await LearningModule.find({ isActive: true })
      .sort({ orderNo: 1 })
      .lean();

    const overview = await Promise.all(
      modules.map(async (module) => {
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
          moduleName: module.name || module.title,
          moduleCode: module.code || "",
          orderNo: module.orderNo || 0,
          questionCount,
          studentCount: progressCount,
          completedCount,
          attemptCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    console.error("GET ANALYSIS OVERVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load analysis overview",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalysisOverview,
  getModuleAnalysis,
};