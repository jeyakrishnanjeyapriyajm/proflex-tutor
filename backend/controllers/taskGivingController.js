const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const EXPECTED_TIME_SECONDS = {
  easy: 45,
  medium: 90,
  hard: 150,
};

const publicQuestionFields = "-correctAnswer -explanation";

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
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

    let progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      progress = await StudentModuleProgress.create({
        student: studentId,
        module: moduleId,
        currentOrderNo: 1,
        score: 0,
        status: "in_progress",
        startedAt: new Date(),
      });
    } else if (progress.status === "not_started") {
      progress.status = "in_progress";
      progress.startedAt = new Date();
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Module started",
      progress,
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
      });
    }

    const question = await Question.findOne({
      module: moduleId,
      orderNo: progress.currentOrderNo,
      isActive: true,
    }).select(publicQuestionFields);

    if (!question) {
      progress.status = "completed";
      progress.completedAt = new Date();
      await progress.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message: "Module completed",
        score: progress.score,
      });
    }

    return res.status(200).json({
      success: true,
      completed: false,
      currentOrderNo: progress.currentOrderNo,
      score: progress.score,
      status: progress.status,
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
    } = req.body;

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

    const previousAttemptCount = await QuestionAttempt.countDocuments({
      student: studentId,
      question: questionId,
    });

    const attemptNo = previousAttemptCount + 1;
    const isCorrect = question.correctAnswer === selectedAnswer;

    const selectedOption = question.options.find(
      (option) => option.label === selectedAnswer
    );

    const misconceptionTag = selectedOption?.misconceptionTag || "";

    const expectedTime = EXPECTED_TIME_SECONDS[question.difficulty] || 90;
    const slowAttempt = Number(timeTakenSeconds) > expectedTime;
    const repeatedWrong = !isCorrect && attemptNo >= 2;

    const isStuck = repeatedWrong || slowAttempt || hintUsed;

    await QuestionAttempt.create({
      student: studentId,
      module: moduleId,
      question: questionId,
      selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds,
      hintUsed,
      isStuck,
      misconceptionTag,
    });

    question.attemptCount += 1;

    if (isCorrect) {
      question.correctCount += 1;
    }

    await question.save();

    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => id.toString() === questionId
      );

      if (!alreadyCompleted) {
        progress.completedQuestionIds.push(questionId);
        progress.score += 1;
        progress.currentOrderNo += 1;
      }

      progress.status = "in_progress";
      progress.stuckQuestion = null;

      const nextQuestion = await Question.findOne({
        module: moduleId,
        orderNo: progress.currentOrderNo,
        isActive: true,
      }).select(publicQuestionFields);

      if (!nextQuestion) {
        progress.status = "completed";
        progress.completedAt = new Date();
        await progress.save();

        return res.status(200).json({
          success: true,
          isCorrect: true,
          completed: true,
          nextAction: "MODULE_COMPLETED",
          message: "Correct. Module completed.",
          score: progress.score,
        });
      }

      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: true,
        isStuck: false,
        nextAction: "NEXT_SEQUENTIAL_TASK",
        message: "Correct. Next task is unlocked.",
        nextQuestion,
        progress,
      });
    }

    if (isStuck) {
      progress.status = "stuck";
      progress.stuckQuestion = questionId;
      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: true,
        nextAction: "SEND_TO_DIFFICULTY_ANALYSIS",
        message:
          "Student is stuck. Send this data to Difficulty Analysis and Decision Making.",
        stuckPayload: {
          moduleId,
          questionId,
          concept: question.concept,
          difficulty: question.difficulty,
          orderNo: question.orderNo,
          attemptNo,
          timeTakenSeconds,
          hintUsed,
          misconceptionTag,
          questionHint: question.hint,
          questionExplanation: question.explanation,
        },
      });
    }

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: false,
      nextAction: "RETRY_SAME_TASK",
      message: "Wrong answer. Retry the same task before moving forward.",
      hint: question.hint,
      attemptNo,
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