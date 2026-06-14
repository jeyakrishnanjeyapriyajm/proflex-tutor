const {
  calculateQuestionDifficulty,
} = require("../services/questionDifficultyService");

const LearningModule = require("../models/LearningModule");
const Question = require("../models/Question");
const StudentModuleProgress = require("../models/StudentModuleProgress");
const QuestionAttempt = require("../models/QuestionAttempt");

const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");

const {
  analyzeStudentInteraction,
} = require("../services/pythonModelService");

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

const getOrCreateConceptMastery = async (studentId, concept) => {
  let mastery = await StudentConceptMastery.findOne({
    student: studentId,
    concept,
  });

  if (!mastery) {
    mastery = await StudentConceptMastery.create({
      student: studentId,
      concept,
      masteryProbability: 0.3,
      masteryLevel: "low",
    });
  }

  return mastery;
};

const buildPythonPayload = ({
  studentId,
  moduleId,
  question,
  selectedAnswer,
  attemptNo,
  timeTakenSeconds,
  hintRequested,
  misconceptionTag,
  mastery,
  updatedQuestion,
}) => {
  const previousWrongRate =
    mastery.totalAttempts > 0
      ? mastery.wrongAttempts / mastery.totalAttempts
      : 0;

  const previousHintRate =
    mastery.totalAttempts > 0
      ? mastery.hintUsedCount / mastery.totalAttempts
      : 0;

  return {
    student_id: String(studentId),
    question_id: String(question._id),
    module_id: String(moduleId),

    concept: question.concept,

    selected_answer: selectedAnswer,
    correct_answer: question.correctAnswer,

    attempt_no: Number(attemptNo),
    time_taken_seconds: Number(timeTakenSeconds) || 0,
    hint_used: Boolean(hintRequested),
    misconception_tag: misconceptionTag || "unknown",

    difficulty: question.difficulty,
    lecturer_difficulty: question.difficulty,
    dynamic_difficulty: updatedQuestion.dynamicDifficulty || "not_enough_data",
    effective_difficulty:
      updatedQuestion.effectiveDifficulty || question.difficulty,

    question_difficulty_score: updatedQuestion.difficultyScore || 0,
    question_correct_rate: updatedQuestion.difficultyStats?.correctRate || 0,
    question_attempt_count: updatedQuestion.attemptCount || 0,
    question_difficulty_source: updatedQuestion.difficultySource || "lecturer",

    student_previous_concept_attempts: mastery.totalAttempts || 0,
    student_previous_concept_wrong_rate: previousWrongRate,
    student_previous_concept_stuck_count: mastery.stuckCount || 0,
    student_previous_hint_rate: previousHintRate,
    student_previous_average_time: mastery.averageTimeSeconds || 0,

    previous_mastery_probability: mastery.masteryProbability || 0.3,
  };
};

const updateConceptMasteryFromModel = async ({
  mastery,
  isCorrect,
  hintRequested,
  timeTakenSeconds,
  modelResult,
}) => {
  const oldTotalAttempts = mastery.totalAttempts || 0;
  const oldAverageTime = mastery.averageTimeSeconds || 0;
  const newTotalAttempts = oldTotalAttempts + 1;

  mastery.totalAttempts = newTotalAttempts;

  if (isCorrect) {
    mastery.correctAttempts = (mastery.correctAttempts || 0) + 1;
  } else {
    mastery.wrongAttempts = (mastery.wrongAttempts || 0) + 1;
  }

  if (Boolean(hintRequested)) {
    mastery.hintUsedCount = (mastery.hintUsedCount || 0) + 1;
  }

  if (modelResult?.is_stuck) {
    mastery.stuckCount = (mastery.stuckCount || 0) + 1;
  }

  mastery.averageTimeSeconds =
    (oldAverageTime * oldTotalAttempts + (Number(timeTakenSeconds) || 0)) /
    newTotalAttempts;

  mastery.masteryProbability =
    modelResult?.final_mastery_probability ??
    modelResult?.bkt_mastery_probability ??
    mastery.masteryProbability;

  mastery.masteryLevel = modelResult?.mastery_level || mastery.masteryLevel;

  mastery.lastSupportAction =
    modelResult?.recommended_support_action || mastery.lastSupportAction;

  mastery.lastRecommendedDifficulty =
    modelResult?.recommended_next_difficulty ||
    mastery.lastRecommendedDifficulty;

  mastery.lastUpdated = new Date();

  await mastery.save();

  return mastery;
};

const saveDecisionLog = async ({
  studentId,
  moduleId,
  question,
  selectedAnswer,
  isCorrect,
  attemptNo,
  timeTakenSeconds,
  hintRequested,
  misconceptionTag,
  modelResult,
  stuckAnalysis,
}) => {
  const decisionLog = await DecisionLog.create({
    student: studentId,
    module: moduleId,
    question: question._id,
    concept: question.concept,

    isCorrect,
    isStuck: Boolean(modelResult?.is_stuck),
    stuckReason: modelResult?.stuck_reason || stuckAnalysis?.stuckReason || "",

    selectedAnswer,
    correctAnswer: question.correctAnswer,

    attemptNo,
    timeTakenSeconds: Number(timeTakenSeconds) || 0,
    hintUsed: Boolean(hintRequested),
    misconceptionTag: misconceptionTag || "unknown",

    bktMasteryProbability: modelResult?.bkt_mastery_probability || 0,
    behaviorMasteryProbability:
      modelResult?.behavior_mastery_probability || 0,
    finalMasteryProbability: modelResult?.final_mastery_probability || 0,
    masteryLevel: modelResult?.mastery_level || "unknown",

    recommendedSupportAction: modelResult?.recommended_support_action || "",
    recommendedNextDifficulty:
      modelResult?.recommended_next_difficulty || "unknown",

    qState: modelResult?.q_state || [],
    qAction: modelResult?.q_action || "",
    reward: modelResult?.reward || 0,

    pythonRawResponse: modelResult || {},
  });

  return decisionLog;
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
        hintUsedCount: 0,
        score: 0,
        percentage: 0,
        overallMasteryScore: 0,
        overallMasteryLevel: "low",
        status: "in_progress",
        completedQuestionIds: [],
        wrongQuestionIds: [],
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
    } = req.body;

    if (!moduleId || !questionId || !selectedAnswer) {
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
    const isCorrect = question.correctAnswer === selectedAnswer;

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
    });

    await QuestionAttempt.create({
      student: studentId,
      module: moduleId,
      question: questionId,
      selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds: Number(timeTakenSeconds) || 0,
      hintUsed: Boolean(hintRequested),
      isStuck: stuckAnalysis.isStuck,
      misconceptionTag,
    });

    question.attemptCount = (question.attemptCount || 0) + 1;

    if (isCorrect) {
      question.correctCount = (question.correctCount || 0) + 1;
    }

    await question.save();

    await calculateQuestionDifficulty(question._id);

    const updatedQuestion = await Question.findById(question._id);

    const mastery = await getOrCreateConceptMastery(
      studentId,
      question.concept
    );

    const pythonPayload = buildPythonPayload({
      studentId,
      moduleId,
      question,
      selectedAnswer,
      attemptNo,
      timeTakenSeconds,
      hintRequested,
      misconceptionTag,
      mastery,
      updatedQuestion,
    });

    let modelResult = null;

    try {
      modelResult = await analyzeStudentInteraction(pythonPayload);
    } catch (modelError) {
      console.error("PYTHON MODEL ERROR:", modelError.message);

      modelResult = {
        student_id: String(studentId),
        question_id: String(question._id),
        module_id: String(moduleId),
        concept: question.concept,
        is_correct: isCorrect,
        bkt_mastery_probability: mastery.masteryProbability || 0.3,
        behavior_mastery_probability: mastery.masteryProbability || 0.3,
        final_mastery_probability: mastery.masteryProbability || 0.3,
        mastery_level: mastery.masteryLevel || "low",
        is_stuck: stuckAnalysis.isStuck,
        stuck_reason: stuckAnalysis.stuckReason,
        recommended_support_action: stuckAnalysis.isStuck
          ? "simple_hint"
          : "retry_same_question",
        recommended_next_difficulty:
          updatedQuestion.effectiveDifficulty || question.difficulty,
        state: {},
        q_state: [],
        q_action: stuckAnalysis.isStuck ? "simple_hint" : "retry_same_question",
        reward: 0,
      };
    }

    await updateConceptMasteryFromModel({
      mastery,
      isCorrect,
      hintRequested,
      timeTakenSeconds,
      modelResult,
    });

    const decisionLog = await saveDecisionLog({
      studentId,
      moduleId,
      question,
      selectedAnswer,
      isCorrect,
      attemptNo,
      timeTakenSeconds,
      hintRequested,
      misconceptionTag,
      modelResult,
      stuckAnalysis,
    });

    progress.lastActivityAt = new Date();
    progress.totalTimeSpentSeconds =
      (progress.totalTimeSpentSeconds || 0) + (Number(timeTakenSeconds) || 0);

    if (Boolean(hintRequested)) {
      progress.hintUsedCount = (progress.hintUsedCount || 0) + 1;
    }

    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => id.toString() === questionId.toString()
      );

      if (!alreadyCompleted) {
        progress.completedQuestionIds.push(questionId);
        progress.completedCount = (progress.completedCount || 0) + 1;
        progress.correctCount = (progress.correctCount || 0) + 1;
        progress.score = (progress.score || 0) + 1;
        progress.currentOrderNo = (progress.currentOrderNo || 1) + 1;
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
          difficultyAnalysis: {
            concept: question.concept,
            bktMasteryProbability: modelResult.bkt_mastery_probability,
            behaviorMasteryProbability:
              modelResult.behavior_mastery_probability,
            finalMasteryProbability: modelResult.final_mastery_probability,
            masteryLevel: modelResult.mastery_level,
          },
          decisionMaking: {
            decisionLogId: decisionLog._id,
          },
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
        difficultyAnalysis: {
          concept: question.concept,
          bktMasteryProbability: modelResult.bkt_mastery_probability,
          behaviorMasteryProbability: modelResult.behavior_mastery_probability,
          finalMasteryProbability: modelResult.final_mastery_probability,
          masteryLevel: modelResult.mastery_level,
        },
        decisionMaking: {
          decisionLogId: decisionLog._id,
        },
      });
    }

    const alreadyWrong = progress.wrongQuestionIds.some(
      (id) => id.toString() === questionId.toString()
    );

    if (!alreadyWrong) {
      progress.wrongQuestionIds.push(questionId);
    }

    progress.wrongCount = (progress.wrongCount || 0) + 1;

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
        difficultyAnalysis: {
          concept: question.concept,
          bktMasteryProbability: modelResult.bkt_mastery_probability,
          behaviorMasteryProbability: modelResult.behavior_mastery_probability,
          finalMasteryProbability: modelResult.final_mastery_probability,
          masteryLevel: modelResult.mastery_level,
        },
        decisionMaking: {
          recommendedSupportAction: modelResult.recommended_support_action,
          recommendedNextDifficulty: modelResult.recommended_next_difficulty,
          qState: modelResult.q_state,
          qAction: modelResult.q_action,
          reward: modelResult.reward,
          decisionLogId: decisionLog._id,
        },
      });
    }

    progress.status = "stuck";
    progress.stuckQuestion = questionId;

    progress.lastRecommendation = {
      action: modelResult.recommended_support_action || "Q_LEARNING_SUPPORT",
      message: "Q-learning selected the best support action.",
      nextQuestion: null,
    };

    await progress.save();

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: true,
      completed: false,
      nextAction: "SHOW_Q_LEARNING_SUPPORT",
      message: "Student is stuck. Q-learning selected a support action.",
      attemptNo,
      stuckAnalysis,
      difficultyAnalysis: {
        concept: question.concept,
        lecturerDifficulty: question.difficulty,
        dynamicDifficulty: updatedQuestion.dynamicDifficulty || "not_enough_data",
        effectiveDifficulty:
          updatedQuestion.effectiveDifficulty || question.difficulty,
        questionDifficultyScore: updatedQuestion.difficultyScore || 0,

        bktMasteryProbability: modelResult.bkt_mastery_probability,
        behaviorMasteryProbability: modelResult.behavior_mastery_probability,
        finalMasteryProbability: modelResult.final_mastery_probability,
        masteryLevel: modelResult.mastery_level,
      },
      decisionMaking: {
        recommendedSupportAction: modelResult.recommended_support_action,
        recommendedNextDifficulty: modelResult.recommended_next_difficulty,
        qState: modelResult.q_state,
        qAction: modelResult.q_action,
        reward: modelResult.reward,
        decisionLogId: decisionLog._id,
      },
      support: {
        action: modelResult.recommended_support_action,
        hint: question.hint,
        detailedHint: question.detailedHint,
        explanation: question.explanation,
        concept: question.concept,
        difficulty: question.difficulty,
        misconceptionTag,
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

    if (decisionLogId) {
      await DecisionLog.findByIdAndUpdate(decisionLogId, {
        status: passed ? "completed" : "recommended",
      });
    }

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