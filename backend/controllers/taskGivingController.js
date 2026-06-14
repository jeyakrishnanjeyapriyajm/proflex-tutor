const {
  calculateQuestionDifficulty,
} = require("../services/questionDifficultyService");
const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const publicQuestionFields = "-correctAnswer -explanation";

const EXPECTED_TIME_SECONDS = {
  easy: 45,
  medium: 90,
  hard: 150,
};

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

const calculatePercentage = (score, totalQuestions) => {
  if (!totalQuestions || totalQuestions <= 0) return 0;
  return Math.round((score / totalQuestions) * 100);
};

const getMasteryLevel = (score, totalQuestions) => {
  const percentage = calculatePercentage(score, totalQuestions);

  if (percentage < 40) return "low";
  if (percentage < 70) return "medium";
  return "high";
};

const getTimeStatus = (timeTakenSeconds, difficulty) => {
  const expectedTime = EXPECTED_TIME_SECONDS[difficulty] || 90;
  return Number(timeTakenSeconds) > expectedTime ? "slow" : "normal";
};

const detectStuckStatus = ({
  isCorrect,
  attemptNo,
  timeTakenSeconds,
  difficulty,
  hintRequested,
  skipped,
}) => {
  const timeStatus = getTimeStatus(timeTakenSeconds, difficulty);

  if (isCorrect) {
    return {
      isStuck: false,
      stuckReason: "",
      timeStatus,
    };
  }

  if (Number(attemptNo) >= 2) {
    return {
      isStuck: true,
      stuckReason: "multiple_wrong_attempts",
      timeStatus,
    };
  }

  if (timeStatus === "slow") {
    return {
      isStuck: true,
      stuckReason: "slow_response_time",
      timeStatus,
    };
  }

  if (Boolean(hintRequested)) {
    return {
      isStuck: true,
      stuckReason: "hint_requested",
      timeStatus,
    };
  }

  if (Boolean(skipped)) {
    return {
      isStuck: true,
      stuckReason: "question_skipped",
      timeStatus,
    };
  }

  return {
    isStuck: false,
    stuckReason: "",
    timeStatus,
  };
};

const findCurrentQuestion = async (moduleId, orderNo) => {
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

    if (!module || !module.isActive) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    const totalQuestions = await Question.countDocuments({
      module: moduleId,
      isActive: true,
    });

    if (totalQuestions === 0) {
      return res.status(400).json({
        success: false,
        message: "This module has no active questions",
      });
    }

    let progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      progress = await StudentModuleProgress.create({
        student: studentId,
        module: moduleId,
        currentOrderNo: 1,
        totalQuestions,
        completedCount: 0,
        correctCount: 0,
        wrongCount: 0,
        skippedCount: 0,
        hintUsedCount: 0,
        score: 0,
        percentage: 0,
        overallMasteryScore: 0,
        overallMasteryLevel: "low",
        status: "in_progress",
        completedQuestionIds: [],
        wrongQuestionIds: [],
        skippedQuestionIds: [],
        startedAt: new Date(),
        lastActivityAt: new Date(),
      });
    } else {
      if (progress.status === "not_started") {
        progress.status = "in_progress";
        progress.startedAt = new Date();
      }

      progress.totalQuestions = totalQuestions;
      progress.lastActivityAt = new Date();

      await progress.save();
    }

    const question = await findCurrentQuestion(moduleId, progress.currentOrderNo);

    if (!question) {
      progress.status = "completed";
      progress.completedAt = new Date();
      progress.percentage = calculatePercentage(progress.score, totalQuestions);
      progress.overallMasteryScore = progress.percentage / 100;
      progress.overallMasteryLevel = getMasteryLevel(
        progress.score,
        totalQuestions
      );
      progress.currentQuestion = null;

      await progress.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message: "Module completed",
        module,
        progress,
      });
    }

    progress.currentQuestion = question._id;
    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Module started",
      module,
      progress,
      question,
      completed: false,
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
    });

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
        score: progress.score,
        progress,
      });
    }

    const question = await findCurrentQuestion(moduleId, progress.currentOrderNo);

    if (!question) {
      progress.status = "completed";
      progress.completedAt = new Date();
      progress.percentage = calculatePercentage(
        progress.score,
        progress.totalQuestions
      );
      progress.overallMasteryScore = progress.percentage / 100;
      progress.overallMasteryLevel = getMasteryLevel(
        progress.score,
        progress.totalQuestions
      );
      progress.currentQuestion = null;

      await progress.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message: "Module completed",
        score: progress.score,
        progress,
      });
    }

    progress.currentQuestion = question._id;
    progress.lastActivityAt = new Date();

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
      hintRequested = false,
      skipped = false,
    } = req.body;

    if (!moduleId || !questionId || (!selectedAnswer && !skipped)) {
      return res.status(400).json({
        success: false,
        message: "moduleId, questionId and selectedAnswer are required",
      });
    }

    const question = await Question.findById(questionId);

    if (!question || !question.isActive) {
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
        message: "Progress not found. Start this module first.",
      });
    }

    if (progress.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "This module is already completed",
      });
    }

    if (question.module.toString() !== moduleId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Question does not belong to this module",
      });
    }

    if (Number(question.orderNo) !== Number(progress.currentOrderNo)) {
      return res.status(400).json({
        success: false,
        message: "This is not the current active question",
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

    const misconceptionTag = selectedOption?.misconceptionTag || "unknown";

    const stuckAnalysis = detectStuckStatus({
      isCorrect,
      attemptNo,
      timeTakenSeconds,
      difficulty: question.difficulty,
      hintRequested,
      skipped,
    });

    await QuestionAttempt.create({
      student: studentId,
      module: moduleId,
      question: questionId,
      selectedAnswer: skipped ? "SKIPPED" : selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      hintUsed: Boolean(hintRequested),
      isStuck: stuckAnalysis.isStuck,
      misconceptionTag,
    });

    question.attemptCount += 1;

if (isCorrect) {
  question.correctCount += 1;
}

await question.save();

// Recalculate dynamic question difficulty after each attempt
await calculateQuestionDifficulty(question._id);

    progress.lastActivityAt = new Date();
    progress.totalTimeSpentSeconds += Number(timeTakenSeconds) || 0;

    if (Boolean(hintRequested)) {
      progress.hintUsedCount += 1;
    }

    if (Boolean(skipped)) {
      progress.skippedCount += 1;

      const alreadySkipped = progress.skippedQuestionIds.some(
        (id) => id.toString() === questionId.toString()
      );

      if (!alreadySkipped) {
        progress.skippedQuestionIds.push(questionId);
      }
    }

    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => id.toString() === questionId.toString()
      );

      if (!alreadyCompleted) {
        progress.completedQuestionIds.push(questionId);
        progress.completedCount += 1;
        progress.correctCount += 1;
        progress.score += 1;
        progress.currentOrderNo += 1;
      }

      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.percentage = calculatePercentage(
        progress.score,
        progress.totalQuestions
      );
      progress.overallMasteryScore = progress.percentage / 100;
      progress.overallMasteryLevel = getMasteryLevel(
        progress.score,
        progress.totalQuestions
      );

      const nextQuestion = await findCurrentQuestion(
        moduleId,
        progress.currentOrderNo
      );

      if (!nextQuestion) {
        progress.status = "completed";
        progress.completedAt = new Date();
        progress.currentQuestion = null;

        await progress.save();

        return res.status(200).json({
          success: true,
          isCorrect: true,
          completed: true,
          isStuck: false,
          nextAction: "MODULE_COMPLETED",
          message: "Correct answer. Module completed.",
          score: progress.score,
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
        message: "Correct answer. Next sequential task is unlocked.",
        nextQuestion,
        progress,
      });
    }

    const alreadyWrong = progress.wrongQuestionIds.some(
      (id) => id.toString() === questionId.toString()
    );

    if (!alreadyWrong) {
      progress.wrongQuestionIds.push(questionId);
    }

    progress.wrongCount += 1;

    if (!stuckAnalysis.isStuck) {
      progress.status = "in_progress";
      progress.stuckQuestion = null;

      progress.lastRecommendation = {
        action: "RETRY_CURRENT_TASK",
        message:
          "Wrong answer, but student is not stuck yet. Allow retry on the same question.",
        nextQuestion: questionId,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: false,
        completed: false,
        nextAction: "RETRY_CURRENT_TASK",
        message:
          "Wrong answer. Try the same question again. Support decision is not required yet.",
        attemptNo,
        stuckAnalysis,
        progress,
      });
    }

    progress.status = "stuck";
    progress.stuckQuestion = questionId;

    progress.lastRecommendation = {
      action: "RUN_Q_LEARNING_DECISION",
      message:
        "Student is stuck. Send this state to the Q-learning decision module.",
      nextQuestion: null,
    };

    await progress.save();

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: true,
      completed: false,
      nextAction: "RUN_Q_LEARNING_DECISION",
      message:
        "Student is stuck. Q-learning should select the best support action.",
      attemptNo,
      stuckAnalysis,
      stuckPayload: {
        studentId,
        moduleId,
        questionId,
        concept: question.concept,
        difficulty: question.difficulty,
        orderNo: question.orderNo,
        selectedAnswer: skipped ? "SKIPPED" : selectedAnswer,
        correctAnswer: question.correctAnswer,
        timeTakenSeconds: Number(timeTakenSeconds) || 0,
        hintUsed: Boolean(hintRequested),
        skipped: Boolean(skipped),
        misconceptionTag,
        timeStatus: stuckAnalysis.timeStatus,
        stuckReason: stuckAnalysis.stuckReason,
        questionHint: question.hint,
        questionDetailedHint: question.detailedHint,
        questionExplanation: question.explanation,
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

const handleSuggestedRoundResult = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const {
      moduleId,
      correctCount,
      totalQuestions,
      stuckQuestionId,
      decisionLogId,
      supportAction,
    } = req.body;

    if (!moduleId || correctCount === undefined || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "moduleId, correctCount and totalQuestions are required",
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

    const passed = Number(correctCount) >= Math.ceil(Number(totalQuestions) / 2);

    if (passed) {
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.lastActivityAt = new Date();

      progress.lastRecommendation = {
        action: "CONTINUE_MAIN_SEQUENCE",
        message: `Student passed recovery round with ${correctCount}/${totalQuestions}. Continue main sequence.`,
        nextQuestion: stuckQuestionId || progress.currentQuestion || null,
      };

      await progress.save();

      let originalQuestion = null;

      if (stuckQuestionId) {
        originalQuestion = await Question.findById(stuckQuestionId).select(
          publicQuestionFields
        );
      }

      return res.status(200).json({
        success: true,
        passed: true,
        message: `Recovery successful. You got ${correctCount}/${totalQuestions}. Continue the learning path.`,
        nextAction: "CONTINUE_MAIN_SEQUENCE",
        supportAction: supportAction || "",
        question: originalQuestion,
        decisionLogId: decisionLogId || null,
        progress,
      });
    }

    progress.status = "stuck";
    progress.stuckQuestion = stuckQuestionId || progress.stuckQuestion;
    progress.lastActivityAt = new Date();

    progress.lastRecommendation = {
      action: "NEEDS_MORE_SUPPORT",
      message: `Student failed recovery round with ${correctCount}/${totalQuestions}. Q-learning should select another support action.`,
      nextQuestion: null,
    };

    await progress.save();

    return res.status(200).json({
      success: true,
      passed: false,
      message: `Recovery not completed. You got ${correctCount}/${totalQuestions}. More support is needed.`,
      masteryLevel: "low",
      nextAction: "NEEDS_MORE_SUPPORT",
      supportAction: supportAction || "",
      decisionLogId: decisionLogId || null,
      progress,
    });
  } catch (error) {
    console.error("SUGGESTED ROUND RESULT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process suggested round result",
      error: error.message,
    });
  }
};

module.exports = {
  getLearningModules,
  startModule,
  getCurrentTask,
  submitTaskAnswer,
  handleSuggestedRoundResult,
};