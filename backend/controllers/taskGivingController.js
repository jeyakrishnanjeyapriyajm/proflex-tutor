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
  const expectedTime = EXPECTED_TIME_SECONDS[normalizeDifficulty(difficulty)] || 90;
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

const getRecoveryDifficulty = ({
  supportAction,
  currentDifficulty,
  recommendedDifficulty,
}) => {
  const normalizedRecommended = normalizeDifficulty(recommendedDifficulty);
  const normalizedCurrent = normalizeDifficulty(currentDifficulty);

  if (["easy", "medium", "hard"].includes(recommendedDifficulty)) {
    return normalizedRecommended;
  }

  if (supportAction === "easier_task") {
    if (normalizedCurrent === "hard") return "medium";
    return "easy";
  }

  if (supportAction === "similar_task") {
    return normalizedCurrent;
  }

  if (supportAction === "harder_challenge") {
    if (normalizedCurrent === "easy") return "medium";
    return "hard";
  }

  if (supportAction === "explanation") {
    if (normalizedCurrent === "hard") return "medium";
    return normalizedCurrent;
  }

  return normalizedCurrent;
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

  // If a module does not have enough questions in one difficulty,
  // fill remaining slots by pedagogical order.
  if (selected.length < 10) {
    const alreadySelected = new Set(
      selected.map((question) => String(question._id))
    );

    const remaining = questions
      .filter((question) => !alreadySelected.has(String(question._id)))
      .sort((a, b) => {
        const difficultyA = DIFFICULTY_RANK[normalizeDifficulty(a.difficulty)] || 2;
        const difficultyB = DIFFICULTY_RANK[normalizeDifficulty(b.difficulty)] || 2;

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
    progress.mainQuestionSequence = await buildPedagogicalQuestionSequence(moduleId);
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

const getAvailableRecoveryCounts = async ({ moduleId, concept, progress }) => {
  const excludeIds = [
    ...(progress.mainQuestionSequence || []),
    ...(progress.blockedQuestionIds || []),
    ...(progress.completedQuestionIds || []),
    ...(progress.skippedQuestionIds || []),
  ].filter(Boolean);

  const baseFilter = {
    module: moduleId,
    concept,
    _id: { $nin: excludeIds },
    isActive: true,
  };

  const [easy, medium, hard] = await Promise.all([
    Question.countDocuments({
      ...baseFilter,
      difficulty: "easy",
    }),
    Question.countDocuments({
      ...baseFilter,
      difficulty: "medium",
    }),
    Question.countDocuments({
      ...baseFilter,
      difficulty: "hard",
    }),
  ]);

  return {
    easy,
    medium,
    hard,
  };
};

const getAdaptiveRecoveryQuestions = async ({
  moduleId,
  concept,
  difficulty,
  count,
  progress,
}) => {
  const excludeIds = [
    ...(progress.mainQuestionSequence || []),
    ...(progress.blockedQuestionIds || []),
    ...(progress.completedQuestionIds || []),
    ...(progress.skippedQuestionIds || []),
  ].filter(Boolean);

  return Question.find({
    module: moduleId,
    concept,
    difficulty: normalizeDifficulty(difficulty),
    _id: { $nin: excludeIds },
    isActive: true,
  })
    .sort({ orderNo: 1 })
    .limit(Number(count) || 0)
    .select(recoveryQuestionFields);
};

// =====================================================
// difficulty 

const getLowerDifficulty = (difficulty) => {
  const value = normalizeDifficulty(difficulty);

  if (value === "hard") return "medium";
  if (value === "medium") return "easy";
  return "easy";
};

const getHigherDifficulty = (difficulty) => {
  const value = normalizeDifficulty(difficulty);

  if (value === "easy") return "medium";
  if (value === "medium") return "hard";
  return "hard";
};

const getFirstAvailableDifficulty = (preferredList, availableCounts) => {
  for (const difficulty of preferredList) {
    if ((availableCounts?.[difficulty] || 0) > 0) {
      return difficulty;
    }
  }

  return null;
};

const resolveRecoveryDifficulty = ({
  currentDifficulty,
  masteryLevel,
  attemptCount,
  supportAction,
  availableCounts,
}) => {
  const difficulty = normalizeDifficulty(currentDifficulty);
  const action = String(supportAction || "").toLowerCase();

  /*
    If Q-learning/action selected easier task,
    always try lower difficulty first.
  */
  if (
    action.includes("easy") ||
    action.includes("easier") ||
    action.includes("lower")
  ) {
    return getFirstAvailableDifficulty(
      [getLowerDifficulty(difficulty), difficulty, getHigherDifficulty(difficulty)],
      availableCounts
    );
  }

  /*
    If action selected similar practice,
    use same difficulty only if student is not very weak.
  */
  if (
    action.includes("similar") ||
    action.includes("medium") ||
    action.includes("practice")
  ) {
    if (masteryLevel === "low" || Number(attemptCount || 0) >= 2) {
      return getFirstAvailableDifficulty(
        [getLowerDifficulty(difficulty), difficulty, getHigherDifficulty(difficulty)],
        availableCounts
      );
    }

    return getFirstAvailableDifficulty(
      [difficulty, getLowerDifficulty(difficulty), getHigherDifficulty(difficulty)],
      availableCounts
    );
  }

  /*
    If action selected harder challenge.
  */
  if (
    action.includes("hard") ||
    action.includes("harder") ||
    action.includes("challenge")
  ) {
    return getFirstAvailableDifficulty(
      [getHigherDifficulty(difficulty), difficulty, getLowerDifficulty(difficulty)],
      availableCounts
    );
  }

  /*
    Default rule:
    If student is stuck, give easier question.
  */
  if (masteryLevel === "low" || Number(attemptCount || 0) >= 2) {
    return getFirstAvailableDifficulty(
      [getLowerDifficulty(difficulty), difficulty, getHigherDifficulty(difficulty)],
      availableCounts
    );
  }

  return getFirstAvailableDifficulty(
    [difficulty, getLowerDifficulty(difficulty), getHigherDifficulty(difficulty)],
    availableCounts
  );
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

    // Python Q-agent uses this to decide recovery question count.
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

    const mainQuestionSequence = await buildPedagogicalQuestionSequence(moduleId);
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

        startedAt: new Date(),
        lastActivityAt: new Date(),
      });
    } else {
      if (progress.status === "not_started") {
        progress.status = "in_progress";
        progress.startedAt = new Date();
      }

      if (
        !progress.mainQuestionSequence ||
        progress.mainQuestionSequence.length === 0
      ) {
        progress.mainQuestionSequence = mainQuestionSequence;
        progress.currentSequenceIndex = 0;
      }

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

    // Do not accidentally show a blocked question again while student is in recovery.
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

    if (progress.status === "recovery") {
      return res.status(400).json({
        success: false,
        message: "Complete the recovery tasks before answering the next main question.",
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

    const supportAction =
      modelResult.recommended_support_action || "retry_same_question";

    const recommendedDifficulty = resolveRecoveryDifficulty({
  currentDifficulty: updatedQuestion.effectiveDifficulty || question.difficulty,
  masteryLevel: modelResult.mastery_level || mastery.masteryLevel || "low",
  attemptCount: attemptNo,
  supportAction,
  availableCounts: availableRecoveryCounts,
});

    let recoveryQuestionCount =
      Number(modelResult.recommended_recovery_count) || 0;

    // Safety fallback:
    // If Q-agent selects recovery support but Python returns 0 count,
    // use 1 available recovery question if MongoDB has one.
    if (RECOVERY_ACTIONS.includes(supportAction) && recoveryQuestionCount <= 0) {
      recoveryQuestionCount = Math.min(
        1,
        availableRecoveryCounts[recommendedDifficulty] || 0
      );
    }

    recoveryQuestionCount = Math.max(0, Math.min(recoveryQuestionCount, 5));

    let recoveryQuestions = [];

    const shouldBlockCurrentQuestion =
      Boolean(modelResult.should_block_current_question) ||
      supportAction === "explanation" ||
      RECOVERY_ACTIONS.includes(supportAction);

    if (shouldBlockCurrentQuestion) {
      await blockQuestionForStudent({
        progress,
        questionId,
        reason:
          supportAction === "explanation"
            ? "explanation_shown"
            : modelResult.stuck_reason ||
              stuckAnalysis.stuckReason ||
              "q_agent_decision",
        supportAction,
      });
    }

    if (RECOVERY_ACTIONS.includes(supportAction) && recoveryQuestionCount > 0) {
      recoveryQuestions = await getAdaptiveRecoveryQuestions({
        moduleId,
        concept: question.concept,
        difficulty: recommendedDifficulty,
        count: recoveryQuestionCount,
        progress,
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
      isStuck: Boolean(modelResult.is_stuck),
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
      blockedQuestionId: shouldBlockCurrentQuestion ? questionId : null,
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

    const passed = Number(correctCount) >= Math.ceil(Number(totalQuestions) / 2);

    if (decisionLogId) {
      await DecisionLog.findByIdAndUpdate(decisionLogId, {
        status: passed ? "completed" : "recommended",
      });
    }

    if (passed) {
      // Recovery passed, so skip the blocked/stuck main question
      // and continue to the next main question in the stored sequence.
      progress.currentSequenceIndex = (progress.currentSequenceIndex || 0) + 1;
      progress.currentOrderNo = (progress.currentOrderNo || 1) + 1;

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
        action: "CONTINUE_MAIN_SEQUENCE",
        message: `Student passed recovery round with ${correctCount}/${totalQuestions}. Continue main sequence.`,
        nextQuestion: nextQuestion?._id || null,
      };

      await progress.save();

      return res.status(200).json({
        success: true,
        passed: true,
        message: `Recovery successful. You got ${correctCount}/${totalQuestions}. Continue the learning path.`,
        nextAction: nextQuestion ? "CONTINUE_MAIN_SEQUENCE" : "MODULE_COMPLETED",
        supportAction: supportAction || "",
        nextQuestion,
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