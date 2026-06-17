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

// Main question response should not expose answer/explanation.
const publicQuestionFields = "-correctAnswer -explanation";

// Recovery questions are checked in frontend in your current flow,
// so correctAnswer is included only for recovery tasks.
const recoveryQuestionFields =
  "_id questionText options codeSnippet difficulty concept orderNo correctAnswer";

const EXPECTED_TIME_SECONDS = {
  easy: 45,
  medium: 90,
  hard: 150,
};

const RECOVERY_ACTIONS = [
  "explanation",
  "easier_task",
  "similar_task",
  "harder_challenge",
];

const CONTENT_ONLY_ACTIONS = ["simple_hint", "retry_same_question"];

const DIFFICULTY_RANK = {
  easy: 1,
  medium: 2,
  hard: 3,
};

// Main path should contain 10 questions.
// This gives pedagogical balance: easy → medium → hard.
const MAIN_SEQUENCE_LIMITS = {
  easy: 3,
  medium: 3,
  hard: 4,
};

// Student reviews the concept for 5 minutes after all recovery questions fail.
const REVIEW_MINUTES = 5;

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

const normalizeDifficulty = (difficulty) => {
  const value = String(difficulty || "").toLowerCase().trim();

  if (["easy", "medium", "hard"].includes(value)) {
    return value;
  }

  return "medium";
};

const getTimeStatus = (timeTakenSeconds, difficulty) => {
  const expectedTime =
    EXPECTED_TIME_SECONDS[normalizeDifficulty(difficulty)] || 90;

  return Number(timeTakenSeconds) > expectedTime ? "slow" : "normal";
};

const getReviewRemainingSeconds = (progress) => {
  if (!progress.reviewUnlockAt) return 0;

  const unlockTime = new Date(progress.reviewUnlockAt).getTime();
  const now = Date.now();

  return Math.max(0, Math.ceil((unlockTime - now) / 1000));
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

const blockQuestionForStudent = async ({
  progress,
  questionId,
  reason,
  supportAction,
}) => {
  const alreadyBlocked = progress.blockedQuestionIds?.some(
    (id) => String(id) === String(questionId)
  );

  if (!alreadyBlocked) {
    progress.blockedQuestionIds = progress.blockedQuestionIds || [];
    progress.blockedQuestionIds.push(questionId);
  }

  progress.blockedQuestionLogs = progress.blockedQuestionLogs || [];
  progress.blockedQuestionLogs.push({
    question: questionId,
    reason,
    supportAction,
    blockedAt: new Date(),
  });

  return progress;
};

// =====================================================
// Pedagogical Sequencing Helpers
// Main sequence: easy → medium → hard
// Recovery questions are not included in mainQuestionSequence
// =====================================================

const buildPedagogicalQuestionSequence = async (moduleId) => {
  const questions = await Question.find({
    module: moduleId,
    isActive: true,
  })
    .select("_id difficulty orderNo concept")
    .lean();

  const grouped = {
    easy: [],
    medium: [],
    hard: [],
  };

  questions.forEach((question) => {
    const difficulty = normalizeDifficulty(question.difficulty);
    grouped[difficulty].push(question);
  });

  Object.keys(grouped).forEach((difficulty) => {
    grouped[difficulty].sort((a, b) => {
      return Number(a.orderNo || 0) - Number(b.orderNo || 0);
    });
  });

  const selected = [
    ...grouped.easy.slice(0, MAIN_SEQUENCE_LIMITS.easy),
    ...grouped.medium.slice(0, MAIN_SEQUENCE_LIMITS.medium),
    ...grouped.hard.slice(0, MAIN_SEQUENCE_LIMITS.hard),
  ];

  // If module does not have enough questions in one difficulty,
  // fill remaining slots by pedagogical order.
  if (selected.length < 10) {
    const alreadySelected = new Set(
      selected.map((question) => String(question._id))
    );

    const remaining = questions
      .filter((question) => !alreadySelected.has(String(question._id)))
      .sort((a, b) => {
        const difficultyA =
          DIFFICULTY_RANK[normalizeDifficulty(a.difficulty)] || 2;

        const difficultyB =
          DIFFICULTY_RANK[normalizeDifficulty(b.difficulty)] || 2;

        if (difficultyA !== difficultyB) {
          return difficultyA - difficultyB;
        }

        return Number(a.orderNo || 0) - Number(b.orderNo || 0);
      });

    selected.push(...remaining.slice(0, 10 - selected.length));
  }

  return selected.slice(0, 10).map((question) => question._id);
};

const ensureMainQuestionSequence = async (progress, moduleId) => {
  if (
    !progress.mainQuestionSequence ||
    progress.mainQuestionSequence.length === 0
  ) {
    progress.mainQuestionSequence =
      await buildPedagogicalQuestionSequence(moduleId);

    progress.currentSequenceIndex = 0;
    progress.totalQuestions = progress.mainQuestionSequence.length;

    await progress.save();
  }

  return progress;
};

const findCurrentQuestionFromSequence = async (progress) => {
  const questionId =
    progress.mainQuestionSequence?.[progress.currentSequenceIndex];

  if (!questionId) return null;

  const isBlocked = progress.blockedQuestionIds?.some(
    (id) => String(id) === String(questionId)
  );

  if (isBlocked) return null;

  return Question.findOne({
    _id: questionId,
    isActive: true,
  }).select(publicQuestionFields);
};

// =====================================================
// Recovery Helpers
// =====================================================

const getRecoveryQuestionFingerprint = (question) => {
  const text = String(question?.questionText || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const code = String(question?.codeSnippet || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  return `${text}__${code}`;
};

const getUsedRecoveryFingerprints = async (progress) => {
  const usedIds = (progress.usedRecoveryQuestionIds || []).filter(Boolean);

  if (usedIds.length === 0) {
    return new Set();
  }

  const usedQuestions = await Question.find({
    _id: { $in: usedIds },
  })
    .select("questionText codeSnippet")
    .lean();

  return new Set(usedQuestions.map(getRecoveryQuestionFingerprint));
};

const getRecoveryExcludeIds = (progress) => {
  return [
    ...(progress.mainQuestionSequence || []),
    ...(progress.blockedQuestionIds || []),
    ...(progress.completedQuestionIds || []),
    ...(progress.skippedQuestionIds || []),
    ...(progress.usedRecoveryQuestionIds || []),
  ].filter(Boolean);
};

const getAvailableRecoveryCountForDifficulty = async ({
  moduleId,
  concept,
  difficulty,
  progress,
}) => {
  const excludeIds = getRecoveryExcludeIds(progress);
  const usedFingerprints = await getUsedRecoveryFingerprints(progress);
  const seenFingerprints = new Set();

  const candidates = await Question.find({
    module: moduleId,
    concept,
    difficulty: normalizeDifficulty(difficulty),
    _id: { $nin: excludeIds },
    isActive: true,
  })
    .sort({ orderNo: 1 })
    .select("_id questionText codeSnippet")
    .lean();

  let count = 0;

  candidates.forEach((question) => {
    const fingerprint = getRecoveryQuestionFingerprint(question);

    if (usedFingerprints.has(fingerprint) || seenFingerprints.has(fingerprint)) {
      return;
    }

    seenFingerprints.add(fingerprint);
    count += 1;
  });

  return count;
};

const getAvailableRecoveryCounts = async ({ moduleId, concept, progress }) => {
  const [easy, medium, hard] = await Promise.all([
    getAvailableRecoveryCountForDifficulty({
      moduleId,
      concept,
      difficulty: "easy",
      progress,
    }),
    getAvailableRecoveryCountForDifficulty({
      moduleId,
      concept,
      difficulty: "medium",
      progress,
    }),
    getAvailableRecoveryCountForDifficulty({
      moduleId,
      concept,
      difficulty: "hard",
      progress,
    }),
  ]);

  return { easy, medium, hard };
};

const getAdaptiveRecoveryQuestions = async ({
  moduleId,
  concept,
  difficulty,
  count,
  progress,
}) => {
  const requestedCount = Math.max(0, Number(count) || 0);

  if (requestedCount <= 0) {
    return [];
  }

  const excludeIds = getRecoveryExcludeIds(progress);
  const usedFingerprints = await getUsedRecoveryFingerprints(progress);
  const selectedFingerprints = new Set();

  const candidates = await Question.find({
    module: moduleId,
    concept,
    difficulty: normalizeDifficulty(difficulty),
    _id: { $nin: excludeIds },
    isActive: true,
  })
    .sort({ orderNo: 1 })
    .select(recoveryQuestionFields)
    .lean();

  const selected = [];

  for (const question of candidates) {
    const fingerprint = getRecoveryQuestionFingerprint(question);

    if (usedFingerprints.has(fingerprint) || selectedFingerprints.has(fingerprint)) {
      continue;
    }

    selectedFingerprints.add(fingerprint);
    selected.push(question);

    if (selected.length >= requestedCount) {
      break;
    }
  }

  return selected;
};

const getFirstAvailableDifficulty = (preferredList, availableCounts) => {
  for (const difficulty of preferredList) {
    if ((availableCounts?.[difficulty] || 0) > 0) {
      return difficulty;
    }
  }

  return null;
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
  availableRecoveryCounts,
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

    available_recovery_counts: availableRecoveryCounts || {
      easy: 0,
      medium: 0,
      hard: 0,
    },
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

    const mainQuestionSequence =
      await buildPedagogicalQuestionSequence(moduleId);

    const totalQuestions = mainQuestionSequence.length;

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

        mainQuestionSequence,
        currentSequenceIndex: 0,
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
        skippedQuestionIds: [],
        blockedQuestionIds: [],
        blockedQuestionLogs: [],
        usedRecoveryQuestionIds: [],

        reviewUnlockAt: null,
        reviewStartedAt: null,
        reviewReason: "",
        reviewSupportAction: "",

        startedAt: new Date(),
        lastActivityAt: new Date(),
      });
    } else {
      if (
        ["not_started", "needs_review", "stuck", "recovery"].includes(
          progress.status
        )
      ) {
        progress.status = "in_progress";
      }

      if (
        !progress.mainQuestionSequence ||
        progress.mainQuestionSequence.length === 0
      ) {
        progress.mainQuestionSequence = mainQuestionSequence;
        progress.currentSequenceIndex = 0;
      }

      progress.reviewUnlockAt = null;
      progress.reviewStartedAt = null;
      progress.reviewReason = "";
      progress.reviewSupportAction = "";

      progress.totalQuestions = progress.mainQuestionSequence.length;
      progress.lastActivityAt = new Date();

      await progress.save();
    }

    const question = await findCurrentQuestionFromSequence(progress);

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

    await ensureMainQuestionSequence(progress, moduleId);

    if (progress.status === "needs_review") {
      const remainingSeconds = getReviewRemainingSeconds(progress);

      if (remainingSeconds > 0) {
        return res.status(200).json({
          success: true,
          completed: false,
          status: "needs_review",
          nextAction: "WAIT_REVIEW_TIME",
          message: `Please review this concept. You can retry after ${remainingSeconds} seconds.`,
          reviewRemainingSeconds: remainingSeconds,
          reviewUnlockAt: progress.reviewUnlockAt,
          currentOrderNo: progress.currentOrderNo,
          currentSequenceIndex: progress.currentSequenceIndex,
          score: progress.score,
          progress,
          question: null,
        });
      }

      // After 5-minute concept review, retry the same main question.
      // Do not skip the main question after explanation.
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.reviewUnlockAt = null;
      progress.reviewStartedAt = null;
      progress.reviewReason = "";
      progress.reviewSupportAction = "";
      progress.lastActivityAt = new Date();

      const question = await findCurrentQuestionFromSequence(progress);

      if (!question) {
        progress.status = "completed";
        progress.completedAt = new Date();
        progress.currentQuestion = null;

        await progress.save();

        return res.status(200).json({
          success: true,
          completed: true,
          nextAction: "MODULE_COMPLETED",
          message: "Module completed.",
          score: progress.score,
          progress,
        });
      }

      progress.currentQuestion = question._id;
      await progress.save();

      return res.status(200).json({
        success: true,
        completed: false,
        status: "in_progress",
        nextAction: "RETRY_MAIN_QUESTION_AFTER_REVIEW",
        message: "Review completed. Try the same main question again.",
        currentOrderNo: progress.currentOrderNo,
        currentSequenceIndex: progress.currentSequenceIndex,
        score: progress.score,
        progress,
        question,
      });
    }

    if (["stuck", "recovery"].includes(progress.status)) {
      return res.status(200).json({
        success: true,
        completed: false,
        status: progress.status,
        message:
          progress.status === "recovery"
            ? "Student is currently in recovery mode. Complete recovery tasks first."
            : "Student is currently stuck. Use the suggested support first.",
        currentOrderNo: progress.currentOrderNo,
        currentSequenceIndex: progress.currentSequenceIndex,
        score: progress.score,
        progress,
        question: null,
      });
    }

    const question = await findCurrentQuestionFromSequence(progress);

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
      currentSequenceIndex: progress.currentSequenceIndex,
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

    if (progress.status === "needs_review") {
      const remainingSeconds = getReviewRemainingSeconds(progress);

      return res.status(400).json({
        success: false,
        message:
          remainingSeconds > 0
            ? `Please review this concept first. You can retry after ${remainingSeconds} seconds.`
            : "Review time finished. Please reload the current task.",
        nextAction:
          remainingSeconds > 0 ? "WAIT_REVIEW_TIME" : "RELOAD_CURRENT_TASK",
        reviewRemainingSeconds: remainingSeconds,
        reviewUnlockAt: progress.reviewUnlockAt,
      });
    }

    if (progress.status === "recovery") {
      return res.status(400).json({
        success: false,
        message:
          "Complete the recovery tasks before answering the next main question.",
      });
    }

    if (String(question.module) !== String(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Question does not belong to this module",
      });
    }

    await ensureMainQuestionSequence(progress, moduleId);

    const expectedQuestionId =
      progress.mainQuestionSequence?.[progress.currentSequenceIndex];

    if (!expectedQuestionId || String(expectedQuestionId) !== String(questionId)) {
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

    const availableRecoveryCounts = await getAvailableRecoveryCounts({
      moduleId,
      concept: question.concept,
      progress,
    });

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
      availableRecoveryCounts,
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
        recommended_recovery_count: 0,
        should_block_current_question: false,
        post_recovery_decision: "continue_main_sequence",
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

    // ─── CORRECT ANSWER PATH ───────────────────────────────────────────────────
    if (isCorrect) {
      const alreadyCompleted = progress.completedQuestionIds.some(
        (id) => String(id) === String(questionId)
      );

      if (!alreadyCompleted) {
        progress.completedQuestionIds.push(questionId);
        progress.completedCount = (progress.completedCount || 0) + 1;
        progress.correctCount = (progress.correctCount || 0) + 1;
        progress.score = (progress.score || 0) + 1;
        progress.currentSequenceIndex = (progress.currentSequenceIndex || 0) + 1;
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

      const nextQuestion = await findCurrentQuestionFromSequence(progress);

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
            behaviorMasteryProbability: modelResult.behavior_mastery_probability,
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

    // ─── WRONG ANSWER PATH ────────────────────────────────────────────────────
    const alreadyWrong = progress.wrongQuestionIds.some(
      (id) => String(id) === String(questionId)
    );

    if (!alreadyWrong) {
      progress.wrongQuestionIds.push(questionId);
    }

    progress.wrongCount = (progress.wrongCount || 0) + 1;

    const finalIsStuck = Boolean(modelResult?.is_stuck || stuckAnalysis.isStuck);

    // Wrong answer but not stuck:
    // Retry the same main question with no hint, no explanation, no recovery,
    // and no block.
    if (!finalIsStuck) {
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.currentQuestion = questionId;
      progress.lastRecommendation = {
        action: "retry_same_question",
        message:
          "Wrong answer without stuck behaviour. Retry the same question without support.",
        nextQuestion: questionId,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        isCorrect: false,
        isStuck: false,
        completed: false,
        nextAction: "RETRY_CURRENT_TASK",
        message: "Try the same question again.",
        attemptNo,
        stuckAnalysis,
        recoveryQuestions: [],
        recoveryQuestionCount: 0,
        blockedQuestionId: null,
        difficultyAnalysis: {
          concept: question.concept,
          lecturerDifficulty: question.difficulty,
          dynamicDifficulty:
            updatedQuestion.dynamicDifficulty || "not_enough_data",
          effectiveDifficulty:
            updatedQuestion.effectiveDifficulty || question.difficulty,
          questionDifficultyScore: updatedQuestion.difficultyScore || 0,
          bktMasteryProbability: modelResult.bkt_mastery_probability,
          behaviorMasteryProbability:
            modelResult.behavior_mastery_probability,
          finalMasteryProbability: modelResult.final_mastery_probability,
          masteryLevel: modelResult.mastery_level,
        },
        decisionMaking: {
          recommendedSupportAction: "retry_same_question",
          recommendedNextDifficulty:
            updatedQuestion.effectiveDifficulty || question.difficulty,
          recoveryQuestionCount: 0,
          shouldBlockCurrentQuestion: false,
          postRecoveryDecision: "retry_same_question",
          qState: modelResult.q_state || [],
          qAction: "retry_same_question",
          reward: modelResult.reward || 0,
          decisionLogId: decisionLog._id,
        },
        support: {
          action: "retry_same_question",
          hint: "",
          detailedHint: "",
          explanation: "",
          concept: question.concept,
          difficulty: question.difficulty,
          recommendedDifficulty:
            updatedQuestion.effectiveDifficulty || question.difficulty,
          misconceptionTag,
        },
        progress,
      });
    }

    const supportAction =
      modelResult.recommended_support_action || "simple_hint";

    let recommendedDifficulty = normalizeDifficulty(
      modelResult.recommended_next_difficulty ||
        updatedQuestion.effectiveDifficulty ||
        question.difficulty
    );

    if ((availableRecoveryCounts[recommendedDifficulty] || 0) <= 0) {
      recommendedDifficulty =
        getFirstAvailableDifficulty(
          ["easy", "medium", "hard"],
          availableRecoveryCounts
        ) || recommendedDifficulty;
    }

    // Recovery count comes from the Q-agent/Python model.
    // Backend only caps it by available, non-repeated recovery questions.
    let recoveryQuestionCount = Math.max(
      0,
      Math.min(
        Number(modelResult.recommended_recovery_count) || 0,
        availableRecoveryCounts[recommendedDifficulty] || 0
      )
    );

    let recoveryQuestions = [];

    // New rule: main question is never blocked.
    // Only harder_challenge success can skip to the next main question.
    const shouldBlockCurrentQuestion = false;

    if (RECOVERY_ACTIONS.includes(supportAction) && recoveryQuestionCount > 0) {
      recoveryQuestions = await getAdaptiveRecoveryQuestions({
        moduleId,
        concept: question.concept,
        difficulty: recommendedDifficulty,
        count: recoveryQuestionCount,
        progress,
      });
    }

    if (recoveryQuestions.length > 0) {
      progress.usedRecoveryQuestionIds = progress.usedRecoveryQuestionIds || [];

      const usedRecoverySet = new Set(
        progress.usedRecoveryQuestionIds.map((id) => String(id))
      );

      recoveryQuestions.forEach((recoveryQuestion) => {
        if (!usedRecoverySet.has(String(recoveryQuestion._id))) {
          progress.usedRecoveryQuestionIds.push(recoveryQuestion._id);
        }
      });
    }

    if (CONTENT_ONLY_ACTIONS.includes(supportAction)) {
      recoveryQuestions = [];
    }

    const shouldShowRecoveryTasks =
      RECOVERY_ACTIONS.includes(supportAction) && recoveryQuestions.length > 0;

    const nextAction = shouldShowRecoveryTasks
      ? "SHOW_RECOVERY_TASKS"
      : supportAction === "retry_same_question"
        ? "RETRY_CURRENT_TASK"
        : "SHOW_Q_LEARNING_SUPPORT";

    progress.status = shouldShowRecoveryTasks
      ? "recovery"
      : supportAction === "retry_same_question" ||
          supportAction === "simple_hint"
        ? "in_progress"
        : "stuck";

    progress.stuckQuestion = shouldShowRecoveryTasks ? questionId : null;

    progress.lastRecommendation = {
      action: supportAction,
      message:
        supportAction === "retry_same_question"
          ? "Q-agent selected retry on the same question."
          : shouldShowRecoveryTasks
            ? "Q-agent selected recovery support."
            : "Q-agent selected learning support.",
      nextQuestion: recoveryQuestions[0]?._id || questionId,
    };

    await progress.save();

    return res.status(200).json({
      success: true,
      isCorrect: false,
      isStuck: finalIsStuck,
      completed: false,
      nextAction,
      message:
        supportAction === "retry_same_question"
          ? "Try the same question again."
          : shouldShowRecoveryTasks
            ? "Support selected. Recovery tasks are suggested."
            : "Support selected. Use the support and try again.",
      attemptNo,
      stuckAnalysis,
      recoveryQuestions,
      recoveryQuestionCount: recoveryQuestions.length,
      blockedQuestionId: null,
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
        recommendedSupportAction: supportAction,
        recommendedNextDifficulty: recommendedDifficulty,
        recoveryQuestionCount: recoveryQuestions.length,
        shouldBlockCurrentQuestion,
        postRecoveryDecision: modelResult.post_recovery_decision,
        qState: modelResult.q_state,
        qAction: modelResult.q_action,
        reward: modelResult.reward,
        decisionLogId: decisionLog._id,
      },
      support: {
        action: supportAction,
        hint: supportAction === "simple_hint" ? question.hint : "",
        detailedHint: "",
        explanation: supportAction === "explanation" ? question.explanation : "",
        concept: question.concept,
        difficulty: question.difficulty,
        recommendedDifficulty,
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
      attemptedCount,
      attemptedRecoveryCount,
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

    await ensureMainQuestionSequence(progress, moduleId);

    const recoveryTotal = Number(totalQuestions) || 0;
    const recoveryAttempted = Number(
      attemptedCount ?? attemptedRecoveryCount ?? totalQuestions
    );

    const passed = Number(correctCount) > 0;
    const recoveryFinished = recoveryAttempted >= recoveryTotal;
    const isHarderChallenge = supportAction === "harder_challenge";

    if (decisionLogId) {
      await DecisionLog.findByIdAndUpdate(decisionLogId, {
        status: passed ? "completed" : "recommended",
      });
    }

    if (passed) {
      if (isHarderChallenge) {
        progress.currentSequenceIndex =
          (progress.currentSequenceIndex || 0) + 1;
        progress.currentOrderNo = (progress.currentOrderNo || 1) + 1;
      }

      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.lastActivityAt = new Date();

      const nextQuestion = await findCurrentQuestionFromSequence(progress);

      if (nextQuestion) {
        progress.currentQuestion = nextQuestion._id;
      } else {
        progress.currentQuestion = null;
        progress.status = "completed";
        progress.completedAt = new Date();
      }

      progress.lastRecommendation = {
        action: isHarderChallenge
          ? "NEXT_MAIN_AFTER_HARDER_CHALLENGE"
          : "RETRY_MAIN_QUESTION_AFTER_RECOVERY",
        message: isHarderChallenge
          ? "Harder challenge passed. Student can continue to the next main question."
          : "Recovery successful. Student should retry the same main question.",
        nextQuestion: nextQuestion?._id || null,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        passed: true,
        message: isHarderChallenge
          ? "Challenge correct. Continue to the next main question."
          : "Recovery successful. Now try the same main question again.",
        nextAction: nextQuestion
          ? isHarderChallenge
            ? "NEXT_SEQUENTIAL_TASK_AFTER_CHALLENGE"
            : "RETRY_MAIN_QUESTION_AFTER_RECOVERY"
          : "MODULE_COMPLETED",
        supportAction: supportAction || "",
        nextQuestion,
        decisionLogId: decisionLogId || null,
        progress,
      });
    }

    if (isHarderChallenge) {
      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.lastActivityAt = new Date();

      const nextQuestion = await findCurrentQuestionFromSequence(progress);

      if (nextQuestion) {
        progress.currentQuestion = nextQuestion._id;
      }

      progress.lastRecommendation = {
        action: "RETRY_MAIN_QUESTION_AFTER_CHALLENGE",
        message:
          "Harder challenge was incorrect. Student should retry the same main question.",
        nextQuestion: nextQuestion?._id || null,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        passed: false,
        recoveryFinished: true,
        message: "Challenge incorrect. Try the same main question again.",
        nextAction: "RETRY_MAIN_QUESTION_AFTER_RECOVERY",
        supportAction: supportAction || "",
        nextQuestion,
        decisionLogId: decisionLogId || null,
        progress,
      });
    }

    if (!recoveryFinished) {
      progress.status = "recovery";
      progress.stuckQuestion = stuckQuestionId || progress.stuckQuestion;
      progress.lastActivityAt = new Date();

      progress.lastRecommendation = {
        action: "CONTINUE_RECOVERY_TASKS",
        message:
          "Recovery answer was wrong. Continue to the next recovery question.",
        nextQuestion: null,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        passed: false,
        recoveryFinished: false,
        message: "Incorrect recovery answer. Try the next recovery question.",
        nextAction: "CONTINUE_RECOVERY_TASKS",
        attemptedCount: recoveryAttempted,
        totalQuestions: recoveryTotal,
        supportAction: supportAction || "",
        decisionLogId: decisionLogId || null,
        progress,
      });
    }

    const reviewStartedAt = new Date();
    const reviewUnlockAt = new Date(
      reviewStartedAt.getTime() + REVIEW_MINUTES * 60 * 1000
    );

    progress.status = "needs_review";
    progress.stuckQuestion = stuckQuestionId || progress.stuckQuestion;
    progress.currentQuestion = null;

    progress.reviewStartedAt = reviewStartedAt;
    progress.reviewUnlockAt = reviewUnlockAt;
    progress.reviewReason = `Recovery failed: ${correctCount}/${totalQuestions}`;
    progress.reviewSupportAction = supportAction || "";

    progress.lastActivityAt = new Date();

    progress.lastRecommendation = {
      action: "WAIT_REVIEW_TIME",
      message: `Student failed all recovery questions with ${correctCount}/${totalQuestions}. Student should review this concept for ${REVIEW_MINUTES} minutes before retrying the same main question.`,
      nextQuestion: null,
    };

    await progress.save();

    return res.status(200).json({
      success: true,
      passed: false,
      recoveryFinished: true,
      message: `Recovery not completed. You got ${correctCount}/${totalQuestions}. Please study this concept for ${REVIEW_MINUTES} minutes before retrying.`,
      masteryLevel: "low",
      nextAction: "WAIT_REVIEW_TIME",
      reviewMinutes: REVIEW_MINUTES,
      reviewRemainingSeconds: REVIEW_MINUTES * 60,
      reviewUnlockAt,
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

const retryModuleAssessment = async (req, res) => {
  try {
    const studentId = getStudentId(req);
    const { moduleId } = req.params;

    const mainQuestionSequence =
      await buildPedagogicalQuestionSequence(moduleId);

    let progress = await StudentModuleProgress.findOne({
      student: studentId,
      module: moduleId,
    });

    if (!progress) {
      progress = await StudentModuleProgress.create({
        student: studentId,
        module: moduleId,
        mainQuestionSequence,
        currentSequenceIndex: 0,
        currentOrderNo: 1,
        totalQuestions: mainQuestionSequence.length,
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
        skippedQuestionIds: [],
        blockedQuestionIds: [],
        blockedQuestionLogs: [],
        usedRecoveryQuestionIds: [],

        reviewUnlockAt: null,
        reviewStartedAt: null,
        reviewReason: "",
        reviewSupportAction: "",

        startedAt: new Date(),
        lastActivityAt: new Date(),
      });
    } else {
      progress.mainQuestionSequence = mainQuestionSequence;
      progress.currentSequenceIndex = 0;
      progress.currentOrderNo = 1;
      progress.totalQuestions = mainQuestionSequence.length;

      progress.completedCount = 0;
      progress.correctCount = 0;
      progress.wrongCount = 0;
      progress.hintUsedCount = 0;
      progress.score = 0;
      progress.percentage = 0;
      progress.overallMasteryScore = 0;
      progress.overallMasteryLevel = "low";

      progress.status = "in_progress";
      progress.stuckQuestion = null;
      progress.currentQuestion = null;

      progress.completedQuestionIds = [];
      progress.wrongQuestionIds = [];
      progress.skippedQuestionIds = [];
      progress.blockedQuestionIds = [];
      progress.blockedQuestionLogs = [];
      progress.usedRecoveryQuestionIds = [];

      progress.reviewUnlockAt = null;
      progress.reviewStartedAt = null;
      progress.reviewReason = "";
      progress.reviewSupportAction = "";

      progress.startedAt = new Date();
      progress.lastActivityAt = new Date();
      progress.completedAt = null;
    }

    const question = await findCurrentQuestionFromSequence(progress);

    if (question) {
      progress.currentQuestion = question._id;
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Assessment restarted. You can try the module again.",
      progress,
      question,
      completed: false,
    });
  } catch (error) {
    console.error("RETRY MODULE ASSESSMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to restart assessment",
      error: error.message,
    });
  }
};

// Task giving review 
const getCompletedModuleReview = async (req, res) => {
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
        message: "Progress not found. Start this module first.",
      });
    }

    if (progress.status !== "completed") {
      return res.status(403).json({
        success: false,
        message: "Review is available only after completing the module.",
      });
    }

    const questions = await Question.find({
      _id: { $in: progress.mainQuestionSequence || [] },
    })
      .select(
        "_id questionText codeSnippet options correctAnswer explanation hint detailedHint concept difficulty orderNo"
      )
      .lean();

    const attempts = await QuestionAttempt.find({
      student: studentId,
      module: moduleId,
      question: { $in: progress.mainQuestionSequence || [] },
    })
      .sort({ createdAt: 1 })
      .lean();

    const attemptMap = new Map();

    attempts.forEach((attempt) => {
      const questionId = String(attempt.question);

      if (!attemptMap.has(questionId)) {
        attemptMap.set(questionId, []);
      }

      attemptMap.get(questionId).push(attempt);
    });

    const questionMap = new Map();

    questions.forEach((question) => {
      questionMap.set(String(question._id), question);
    });

    const reviewQuestions = (progress.mainQuestionSequence || [])
      .map((questionId) => {
        const question = questionMap.get(String(questionId));

        if (!question) return null;

        const questionAttempts = attemptMap.get(String(question._id)) || [];
        const lastAttempt = questionAttempts[questionAttempts.length - 1];

        const correctOption = question.options?.find(
          (option) => option.label === question.correctAnswer
        );

        const selectedOption = question.options?.find(
          (option) => option.label === lastAttempt?.selectedAnswer
        );

        return {
          questionId: question._id,
          orderNo: question.orderNo,
          questionText: question.questionText,
          codeSnippet: question.codeSnippet || "",
          concept: question.concept,
          difficulty: question.difficulty,

          options: question.options || [],

          selectedAnswer: lastAttempt?.selectedAnswer || "",
          selectedAnswerText: selectedOption?.text || "",
          correctAnswer: question.correctAnswer,
          correctAnswerText: correctOption?.text || "",

          isCorrect: Boolean(lastAttempt?.isCorrect),
          attemptCount: questionAttempts.length,
          timeTakenSeconds: lastAttempt?.timeTakenSeconds || 0,
          hintUsed: Boolean(lastAttempt?.hintUsed),
          isStuck: Boolean(lastAttempt?.isStuck),
          misconceptionTag: lastAttempt?.misconceptionTag || "",

          hint: question.hint || "",
          detailedHint: question.detailedHint || "",
          explanation: question.explanation || "",
        };
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Completed module review loaded.",
      score: progress.score,
      percentage: progress.percentage,
      totalQuestions: progress.totalQuestions,
      overallMasteryLevel: progress.overallMasteryLevel,
      progress,
      reviewQuestions,
    });
  } catch (error) {
    console.error("GET COMPLETED MODULE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load completed module review",
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
  retryModuleAssessment,
  getCompletedModuleReview,
};