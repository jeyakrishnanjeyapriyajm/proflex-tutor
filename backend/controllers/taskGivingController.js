const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const publicQuestionFields =
  "-correctAnswer -explanation -detailedHint -workedExample -tracingSteps";

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const getMasteryLevel = (score) => {
  if (score >= 0.7) return "high";
  if (score >= 0.4) return "medium";
  return "low";
};

const getExpectedTime = (question) => {
  if (question.expectedTime) return question.expectedTime;

  if (question.difficulty === "easy") return 45;
  if (question.difficulty === "medium") return 90;
  return 150;
};

const buildQLearningState = ({
  moduleCode,
  concept,
  difficulty,
  masteryLevel,
  attemptNo,
  timeStatus,
  hintUsed,
  misconceptionTag,
}) => {
  return [
    moduleCode || "module",
    concept || "concept",
    difficulty || "medium",
    masteryLevel || "low",
    attemptNo >= 3 ? "3_plus_attempts" : `${attemptNo}_attempt`,
    timeStatus || "normal",
    hintUsed ? "hint_used" : "no_hint",
    misconceptionTag || "none",
  ].join("|");
};

const chooseSupportAction = ({
  difficulty,
  masteryLevel,
  attemptNo,
  timeStatus,
  misconceptionTag,
}) => {
  if (attemptNo >= 3 && masteryLevel === "low" && difficulty === "hard") {
    return "worked_example";
  }

  if (attemptNo >= 3 && timeStatus === "slow") {
    return "code_tracing_steps";
  }

  if (misconceptionTag) {
    return "concept_explanation";
  }

  if (masteryLevel === "low") {
    return "detailed_hint";
  }

  if (masteryLevel === "medium") {
    return "similar_question";
  }

  return "retry_same_question";
};

const getSupportPayload = (action, question) => {
  switch (action) {
    case "simple_hint":
      return {
        type: "hint",
        text: question.hint || "Review the main concept and try again.",
      };

    case "detailed_hint":
      return {
        type: "detailed_hint",
        text:
          question.detailedHint ||
          question.hint ||
          "Break the question into smaller parts and check each option carefully.",
      };

    case "concept_explanation":
      return {
        type: "explanation",
        text:
          question.explanation ||
          "Review the concept explanation and compare it with the selected option.",
      };

    case "worked_example":
      return {
        type: "worked_example",
        text:
          question.workedExample ||
          question.explanation ||
          "Study a similar worked example before retrying this question.",
      };

    case "code_tracing_steps":
      return {
        type: "tracing_steps",
        steps:
          question.tracingSteps && question.tracingSteps.length > 0
            ? question.tracingSteps
            : [
                "Read the code from top to bottom.",
                "Identify variable values before the loop or condition.",
                "Trace each line step by step.",
                "Compare the final value with the answer options.",
              ],
      };

    case "easier_question":
      return {
        type: "easier_question",
        text: "Try an easier question from the same concept first.",
      };

    case "similar_question":
      return {
        type: "similar_question",
        text: "Try a similar question to strengthen this concept.",
      };

    case "retry_same_question":
      return {
        type: "retry",
        text: "Try the same question again after reviewing the hint.",
      };

    default:
      return {
        type: "support",
        text: "Review the concept and try again.",
      };
  }
};

const calculateReward = ({ isCorrect, isStuck, skipped, timeTakenSeconds, expectedTime }) => {
  if (skipped) return -6;
  if (isCorrect && !isStuck && timeTakenSeconds <= expectedTime) return 10;
  if (isCorrect) return 8;
  if (isStuck) return -4;
  return -2;
};

const updateConceptMastery = ({ progress, question, isCorrect, hintUsed, skipped, timeTakenSeconds }) => {
  const concept = question.concept;
  const expectedTime = getExpectedTime(question);

  let conceptItem = progress.conceptMastery.find(
    (item) => item.concept === concept
  );

  if (!conceptItem) {
    progress.conceptMastery.push({
      concept,
      masteryScore: 0.5,
      masteryLevel: "medium",
      correctCount: 0,
      wrongCount: 0,
      hintUsedCount: 0,
      lastUpdatedAt: new Date(),
    });

    conceptItem = progress.conceptMastery.find(
      (item) => item.concept === concept
    );
  }

  let change = 0;

  if (isCorrect && !hintUsed) change += 0.1;
  if (isCorrect && hintUsed) change += 0.05;
  if (!isCorrect) change -= 0.03;
  if (skipped) change -= 0.05;
  if (timeTakenSeconds > expectedTime) change -= 0.02;

  conceptItem.masteryScore = clamp(
    Number(conceptItem.masteryScore || 0) + change,
    0,
    1
  );

  conceptItem.masteryLevel = getMasteryLevel(conceptItem.masteryScore);

  if (isCorrect) conceptItem.correctCount += 1;
  if (!isCorrect) conceptItem.wrongCount += 1;
  if (hintUsed) conceptItem.hintUsedCount += 1;

  conceptItem.lastUpdatedAt = new Date();

  if (progress.conceptMastery.length > 0) {
    const total = progress.conceptMastery.reduce(
      (sum, item) => sum + Number(item.masteryScore || 0),
      0
    );

    progress.overallMasteryScore = Number(
      (total / progress.conceptMastery.length).toFixed(2)
    );

    progress.overallMasteryLevel = getMasteryLevel(
      progress.overallMasteryScore
    );
  }

  return {
    masteryBefore: clamp(Number(conceptItem.masteryScore || 0) - change, 0, 1),
    masteryAfter: conceptItem.masteryScore,
    masteryLevel: conceptItem.masteryLevel,
  };
};

const updateQuestionStatistics = async (question, isCorrect) => {
  if (!question.statistics) {
    question.statistics = {
      attemptCount: 0,
      correctCount: 0,
      wrongCount: 0,
      difficultyIndex: 0,
    };
  }

  question.statistics.attemptCount += 1;

  if (isCorrect) {
    question.statistics.correctCount += 1;
  } else {
    question.statistics.wrongCount += 1;
  }

  if (question.statistics.attemptCount > 0) {
    question.statistics.difficultyIndex = Number(
      (
        question.statistics.correctCount / question.statistics.attemptCount
      ).toFixed(2)
    );
  }

  if (question.statistics.difficultyIndex >= 0.7) {
    question.dynamicDifficulty = "easy";
  } else if (question.statistics.difficultyIndex >= 0.4) {
    question.dynamicDifficulty = "medium";
  } else {
    question.dynamicDifficulty = "hard";
  }

  await question.save();
};

const getNextSequentialQuestion = async (moduleId, orderNo) => {
  return Question.findOne({
    module: moduleId,
    orderNo,
    isActive: true,
  }).select(publicQuestionFields);
};

const getLearningModules = async (req, res) => {
  try {
    const modules = await LearningModule.find({ isActive: true }).sort({
      orderNo: 1,
    });

    return res.status(200).json({
      success: true,
      modules,
    });
  } catch (error) {
    console.error("GET LEARNING MODULES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load modules",
      error: error.message,
    });
  }
};

const startModule = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { moduleId } = req.params;

    const module = await LearningModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const firstQuestion = await Question.findOne({
      module: moduleId,
      orderNo: 1,
      isActive: true,
    }).select(publicQuestionFields);

    let progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      progress = await StudentModuleProgress.create({
        student: studentId,
        module: moduleId,
        currentOrderNo: 1,
        currentQuestion: firstQuestion?._id || null,
        totalQuestions: module.totalQuestions || 10,
        score: 0,
        percentage: 0,
        status: "in_progress",
        startedAt: new Date(),
        lastActivityAt: new Date(),
      });
    } else if (progress.status === "not_started") {
      progress.status = "in_progress";
      progress.startedAt = new Date();
      progress.lastActivityAt = new Date();
      progress.currentQuestion = firstQuestion?._id || null;
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Module started",
      module,
      progress,
      question: firstQuestion,
    });
  } catch (error) {
    console.error("START MODULE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start module",
      error: error.message,
    });
  }
};

const getCurrentTask = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { moduleId } = req.params;

    const progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    }).populate("module");

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Start this module first",
      });
    }

    if (progress.status === "completed") {
      return res.status(200).json({
        success: true,
        completed: true,
        message: "Module completed",
        progress,
      });
    }

    const question = await Question.findOne({
      module: moduleId,
      orderNo: progress.currentOrderNo,
      isActive: true,
    }).select(publicQuestionFields);

    if (!question) {
      progress.status = "completed";
      progress.percentage = 100;
      progress.completedAt = new Date();
      progress.lastActivityAt = new Date();
      await progress.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message: "Module completed",
        progress,
      });
    }

    progress.currentQuestion = question._id;
    await progress.save();

    return res.status(200).json({
      success: true,
      completed: false,
      currentOrderNo: progress.currentOrderNo,
      score: progress.score,
      status: progress.status,
      progress,
      question,
    });
  } catch (error) {
    console.error("GET CURRENT TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load task",
      error: error.message,
    });
  }
};

const submitTaskAnswer = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const {
      moduleId,
      questionId,
      selectedAnswer,
      timeTakenSeconds = 0,
      hintUsed = false,
      detailedHintUsed = false,
      skipped = false,
    } = req.body;

    if (!moduleId || !questionId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        message: "moduleId, questionId and selectedAnswer are required",
      });
    }

    const module = await LearningModule.findById(moduleId);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    if (progress.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This module is already completed",
      });
    }

    const previousAttemptCount = await QuestionAttempt.countDocuments({
      student: studentId,
      module: moduleId,
      question: questionId,
    });

    const attemptNo = previousAttemptCount + 1;
    const isCorrect = !skipped && question.correctAnswer === selectedAnswer;

    const selectedOption = question.options.find(
      (option) => option.label === selectedAnswer
    );

    const misconceptionTag = !isCorrect
      ? selectedOption?.misconceptionTag || ""
      : "";

    const misconceptionExplanation = !isCorrect
      ? selectedOption?.misconceptionExplanation || ""
      : "";

    const expectedTime = getExpectedTime(question);
    const timeStatus = timeTakenSeconds > expectedTime ? "slow" : "normal";

    const masteryResult = updateConceptMastery({
      progress,
      question,
      isCorrect,
      hintUsed: hintUsed || detailedHintUsed,
      skipped,
      timeTakenSeconds,
    });

    const shouldBeStuck =
      !isCorrect &&
      (attemptNo >= 3 ||
        skipped ||
        detailedHintUsed ||
        (attemptNo >= 2 && timeTakenSeconds > expectedTime));

    let stuckReason = "";

    if (shouldBeStuck) {
      if (attemptNo >= 3) stuckReason = "Multiple wrong attempts";
      else if (skipped) stuckReason = "Question skipped";
      else if (detailedHintUsed) stuckReason = "Detailed hint used";
      else if (timeTakenSeconds > expectedTime) stuckReason = "Slow response time";
      else stuckReason = "Student needs support";
    }

    const qLearningState = shouldBeStuck
      ? buildQLearningState({
          moduleCode: module.code,
          concept: question.concept,
          difficulty: question.dynamicDifficulty || question.difficulty,
          masteryLevel: masteryResult.masteryLevel,
          attemptNo,
          timeStatus,
          hintUsed: hintUsed || detailedHintUsed,
          misconceptionTag,
        })
      : "";

    const qLearningAction = shouldBeStuck
      ? chooseSupportAction({
          difficulty: question.dynamicDifficulty || question.difficulty,
          masteryLevel: masteryResult.masteryLevel,
          attemptNo,
          timeStatus,
          misconceptionTag,
        })
      : "";

    const qLearningReward = calculateReward({
      isCorrect,
      isStuck: shouldBeStuck,
      skipped,
      timeTakenSeconds,
      expectedTime,
    });

    let recommendation = {
      action: "",
      message: "",
      nextQuestion: null,
    };

    if (shouldBeStuck) {
      recommendation = {
        action: qLearningAction,
        message: "Student is stuck. Provide adaptive support before moving forward.",
        nextQuestion: null,
      };
    }

    await QuestionAttempt.create({
      student: studentId,
      module: moduleId,
      question: questionId,
      selectedAnswer: skipped ? "SKIPPED" : selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds,
      hintUsed,
      detailedHintUsed,
      skipped,
      isStuck: shouldBeStuck,
      stuckReason,
      misconceptionTag,
      misconceptionExplanation,
      masteryBefore: masteryResult.masteryBefore,
      masteryAfter: masteryResult.masteryAfter,
      qLearningState,
      qLearningAction,
      qLearningReward,
      recommendation,
    });

    await updateQuestionStatistics(question, isCorrect);

    progress.totalTimeSpentSeconds += Number(timeTakenSeconds || 0);
    progress.lastActivityAt = new Date();

    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => id.toString() === questionId
      );

      if (!alreadyCompleted) {
        progress.completedQuestionIds.push(questionId);
        progress.completedCount += 1;
        progress.correctCount += 1;
        progress.score += 1;
      }

      progress.currentOrderNo = question.orderNo + 1;
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.lastRecommendation = {
        action: "next_question",
        message: "Correct answer. Continue to the next task.",
        nextQuestion: null,
      };

      progress.percentage = Math.round(
        (progress.completedCount / progress.totalQuestions) * 100
      );

      const nextQuestion = await getNextSequentialQuestion(
        moduleId,
        progress.currentOrderNo
      );

      if (!nextQuestion) {
        progress.status = "completed";
        progress.percentage = 100;
        progress.completedAt = new Date();
        progress.currentQuestion = null;

        await progress.save();

        return res.status(200).json({
          success: true,
          isCorrect: true,
          completed: true,
          nextAction: "MODULE_COMPLETED",
          message: "Correct answer. Module completed.",
          progress,
        });
      }

      progress.currentQuestion = nextQuestion._id;
      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: true,
        isStuck: false,
        completed: false,
        nextAction: "NEXT_SEQUENTIAL_TASK",
        message: "Correct answer. Next task is unlocked.",
        nextQuestion,
        progress,
      });
    }

    progress.wrongCount += skipped ? 0 : 1;
    progress.skippedCount += skipped ? 1 : 0;
    progress.hintUsedCount += hintUsed || detailedHintUsed ? 1 : 0;

    if (!progress.wrongQuestionIds.some((id) => id.toString() === questionId)) {
      progress.wrongQuestionIds.push(questionId);
    }

    if (
      skipped &&
      !progress.skippedQuestionIds.some((id) => id.toString() === questionId)
    ) {
      progress.skippedQuestionIds.push(questionId);
    }

    if (shouldBeStuck) {
      progress.status = "stuck";
      progress.stuckQuestion = questionId;
      progress.lastRecommendation = recommendation;
      await progress.save();

      const support = getSupportPayload(qLearningAction, question);

      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: true,
        completed: false,
        nextAction: "ADAPTIVE_SUPPORT",
        message: "Student is stuck. Adaptive support is recommended.",
        attemptNo,
        misconceptionTag,
        misconceptionExplanation,
        qLearning: {
          state: qLearningState,
          action: qLearningAction,
          reward: qLearningReward,
        },
        support,
        progress,
      });
    }

    progress.status = "in_progress";
    progress.stuckQuestion = null;
    await progress.save();

    if (attemptNo === 1) {
      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: false,
        completed: false,
        nextAction: "SHOW_HINT",
        message: "Wrong answer. Read the hint and try again.",
        attemptNo,
        misconceptionTag,
        misconceptionExplanation,
        support: {
          type: "hint",
          text: question.hint || "Review the key concept and try again.",
        },
        progress,
      });
    }

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: false,
      completed: false,
      nextAction: "SHOW_DETAILED_HINT",
      message: "Still incorrect. Read the detailed hint and try again.",
      attemptNo,
      misconceptionTag,
      misconceptionExplanation,
      support: {
        type: "detailed_hint",
        text:
          question.detailedHint ||
          question.explanation ||
          "Read the concept explanation carefully and try again.",
      },
      progress,
    });
  } catch (error) {
    console.error("SUBMIT TASK ANSWER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};

module.exports = {
  getLearningModules,
  startModule,
  getCurrentTask,
  submitTaskAnswer,
};