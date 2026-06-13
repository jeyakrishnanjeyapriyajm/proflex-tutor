const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const publicQuestionFields = "-correctAnswer -explanation";
const axios = require("axios");

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
    } = req.body;

    if (!moduleId || !questionId || !selectedAnswer) {
      return res.status(400).json({
        success: false,
        message: "moduleId, questionId and selectedAnswer are required",
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
    const isCorrect = question.correctAnswer === selectedAnswer;

    const selectedOption = question.options.find(
      (option) => option.label === selectedAnswer,
    );

    const misconceptionTag = selectedOption?.misconceptionTag || "";

    await QuestionAttempt.create({
      student: studentId,
      module: moduleId,
      question: questionId,
      selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds,
      hintUsed: attemptNo >= 2,
      isStuck: !isCorrect && attemptNo >= 3,
      misconceptionTag,
    });

    question.attemptCount += 1;

    if (isCorrect) {
      question.correctCount += 1;
    }

    await question.save();

    // CASE 1: CORRECT ANSWER
    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => id.toString() === questionId,
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
          message: "Correct answer. Module completed.",
          score: progress.score,
        });
      }

      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: true,
        isStuck: false,
        nextAction: "NEXT_SEQUENTIAL_TASK",
        message: "Correct answer. Next task is unlocked.",
        nextQuestion,
        progress,
      });
    }

    // CASE 2: FIRST WRONG ATTEMPT → SHOW HINT
    if (attemptNo === 1) {
      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: false,
        nextAction: "SHOW_HINT",
        message: "Wrong answer. Read the hint and try again.",
        attemptNo,
        support: {
          type: "hint",
          text: question.hint || "Review the key concept and try again.",
        },
      });
    }

    // CASE 3: SECOND WRONG ATTEMPT → SHOW EXPLANATION
    if (attemptNo === 2) {
      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: false,
        nextAction: "SHOW_EXPLANATION",
        message: "Still incorrect. Read the explanation and try again.",
        attemptNo,
        support: {
          type: "explanation",
          text:
            question.explanation ||
            "Read the concept explanation carefully and try again.",
        },
      });
    }

    // CASE 4: THIRD WRONG ATTEMPT → SEND TO DIFFICULTY ANALYSIS
    progress.status = "stuck";
    progress.stuckQuestion = questionId;
    await progress.save();

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: true,
      nextAction: "SEND_TO_DIFFICULTY_ANALYSIS",
      message:
        "Student is stuck after three attempts. Send this data to Difficulty Analysis and Decision Making.",
      attemptNo,
      stuckPayload: {
        studentId,
        moduleId,
        questionId,
        concept: question.concept,
        difficulty: question.difficulty,
        orderNo: question.orderNo,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        timeTakenSeconds,
        hintUsed: true,
        misconceptionTag,
        questionHint: question.hint,
        questionExplanation: question.explanation,
      },
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

// ─── Difficulty Analysis ─────────────────────────────────────────────────────
// Update runDifficultyAnalysis to fetch 5 questions instead of 3
const runDifficultyAnalysis = async (req, res) => {
  try {
    const {
      questionId,
      concept,
      difficulty,
      selectedAnswer,
      correctAnswer,
      attemptNo,
      timeTakenSeconds,
      hintUsed,
      misconceptionTag,
    } = req.body;

    const studentId = getStudentId(req);
    const pythonUrl = process.env.PYTHON_MODEL_URL;

    const modelRes = await axios.post(`${pythonUrl}/analyze`, {
      student_id: studentId.toString(),
      question_id: questionId,
      concept,
      difficulty,
      selected_answer: selectedAnswer,
      correct_answer: correctAnswer,
      attempt_no: Number(attemptNo) || 3,
      time_taken_seconds: Number(timeTakenSeconds) || 0,
      hint_used: Boolean(hintUsed),
      misconception_tag: misconceptionTag || "unknown",
    });

    const {
      recommended_next_difficulty,
      recommended_support_action,
      mastery_level,
      bkt_mastery_probability,
    } = modelRes.data;

    let suggestedQuestions = [];

    // Only show 5 suggestions if recommended difficulty is easy
    if (recommended_next_difficulty === "easy") {
      suggestedQuestions = await Question.find({
        concept: concept,
        difficulty: "easy",
        _id: { $ne: questionId },
        isActive: true,
      })
        .limit(5)
        .select(
          "_id questionText options codeSnippet difficulty concept correctAnswer hint",
        );
    }

    return res.status(200).json({
      success: true,
      recommended_next_difficulty,
      recommended_support_action,
      mastery_level,
      bkt_mastery_probability,
      suggestedQuestions,
    });
  } catch (error) {
    console.error("DIFFICULTY ANALYSIS ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Difficulty analysis failed. Is Python model running?",
    });
  }
};

// NEW endpoint — handle the result after all 5 suggestions are done
const handleSuggestedRoundResult = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { moduleId, correctCount, totalQuestions, stuckQuestionId } =
      req.body;

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

    const passed = correctCount >= 3; // 3 out of 5 required

    if (passed) {
      // ── PASS: let them continue the stuck question ──────────────────────
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      await progress.save();

      return res.status(200).json({
        success: true,
        passed: true,
        message: `Great! You got ${correctCount}/${totalQuestions}. You can continue.`,
        nextAction: "CONTINUE_STUCK_QUESTION",
      });
    } else {
      // ── FAIL: reset module, show low mastery, restart from Q1 ───────────
      progress.status = "in_progress";
      progress.currentOrderNo = 1;
      progress.score = 0;
      progress.completedQuestionIds = [];
      progress.stuckQuestion = null;
      await progress.save();

      return res.status(200).json({
        success: true,
        passed: false,
        message: `You got ${correctCount}/${totalQuestions}. Your mastery on this concept is Low.`,
        masteryLevel: "low",
        nextAction: "RESTART_MODULE",
      });
    }
  } catch (error) {
    console.error("SUGGESTED ROUND RESULT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process round result",
      error: error.message,
    });
  }
};

module.exports = {
  getLearningModules,
  startModule,
  getCurrentTask,
  submitTaskAnswer,
  runDifficultyAnalysis,
  handleSuggestedRoundResult,
};
