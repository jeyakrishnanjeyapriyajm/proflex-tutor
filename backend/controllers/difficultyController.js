const Question = require("../models/Question");
const StudentConceptMastery = require("../models/StudentConceptMastery");
const DecisionLog = require("../models/DecisionLog");
const AIModelSetting = require("../models/AIModelSetting");
const {
  callPythonDifficultyModel,
  callPythonRewardModel,
} = require("../services/pythonModelService");

const getStudentId = (req) => {
  return req.user?._id || req.user?.id;
};

const normalizeMasteryLevel = (level) => {
  if (!level) return "unknown";

  const value = String(level).toLowerCase();

  if (["low", "medium", "high"].includes(value)) return value;

  return "unknown";
};

const normalizeDifficulty = (difficulty) => {
  if (!difficulty) return "unknown";

  const value = String(difficulty).toLowerCase();

  if (["easy", "medium", "hard"].includes(value)) return value;

  return "unknown";
};

const normalizeSupportAction = (action) => {
  if (!action) return "worked_example";

  const value = String(action).toLowerCase();

  const allowed = [
    "simple_hint",
    "detailed_hint",
    "explanation",
    "worked_example",
    "easier_task",
    "similar_task",
    "harder_challenge",
    "revision_note",
    "code_tracing_steps",
    "retry_same_question",
  ];

  if (allowed.includes(value)) return value;

  return "worked_example";
};

const getOrCreateAISettings = async () => {
  let settings = await AIModelSetting.findOne({ name: "default" });

  if (!settings) {
    settings = await AIModelSetting.create({ name: "default" });
  }

  return settings;
};

const updateStudentMasteryFromModel = async ({
  studentId,
  concept,
  bktMasteryProbability,
  masteryLevel,
  isCorrect,
  timeTakenSeconds,
  hintUsed,
}) => {
  const existing = await StudentConceptMastery.findOne({
    student: studentId,
    concept,
  });

  const totalAttempts = (existing?.totalAttempts || 0) + 1;
  const correctAttempts = (existing?.correctAttempts || 0) + (isCorrect ? 1 : 0);
  const wrongAttempts = (existing?.wrongAttempts || 0) + (!isCorrect ? 1 : 0);
  const hintUsedCount = (existing?.hintUsedCount || 0) + (hintUsed ? 1 : 0);

  const previousAverage = existing?.averageTimeSeconds || 0;

  const averageTimeSeconds =
    totalAttempts === 1
      ? Number(timeTakenSeconds) || 0
      : Math.round(
          (previousAverage * (totalAttempts - 1) +
            (Number(timeTakenSeconds) || 0)) /
            totalAttempts
        );

  const updated = await StudentConceptMastery.findOneAndUpdate(
    {
      student: studentId,
      concept,
    },
    {
      $set: {
        masteryProbability: Number(bktMasteryProbability) || 0,
        masteryLevel: normalizeMasteryLevel(masteryLevel),
        totalAttempts,
        correctAttempts,
        wrongAttempts,
        hintUsedCount,
        averageTimeSeconds,
        lastUpdated: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  return updated;
};

const buildSupportContent = (supportAction, question) => {
  if (!question) {
    return {
      type: supportAction,
      text: "Review the related concept and try a recovery task.",
    };
  }

  if (supportAction === "simple_hint") {
    return {
      type: "simple_hint",
      text: question.hint || "Think about the core concept and try again.",
    };
  }

  if (supportAction === "detailed_hint") {
    return {
      type: "detailed_hint",
      text:
        question.detailedHint ||
        question.hint ||
        "Break the problem into smaller steps and trace it carefully.",
    };
  }

  if (supportAction === "explanation") {
    return {
      type: "explanation",
      text:
        question.explanation ||
        "Read the concept explanation and understand why the selected answer is incorrect.",
    };
  }

  if (supportAction === "worked_example") {
    return {
      type: "worked_example",
      text:
        question.explanation ||
        "Study a similar worked example first, then try a recovery task.",
    };
  }

  if (supportAction === "revision_note") {
    return {
      type: "revision_note",
      text:
        question.detailedHint ||
        question.explanation ||
        "Revise this concept before continuing.",
    };
  }

  if (supportAction === "code_tracing_steps") {
    return {
      type: "code_tracing_steps",
      text:
        question.detailedHint ||
        "Trace the code line by line. Write the value of each variable after every statement.",
    };
  }

  if (supportAction === "retry_same_question") {
    return {
      type: "retry_same_question",
      text: "Try the same question again after reviewing your mistake.",
    };
  }

  return {
    type: supportAction,
    text: "Complete the recommended recovery task.",
  };
};

const getRecoveryQuestions = async ({
  concept,
  currentQuestionId,
  supportAction,
  recommendedNextDifficulty,
  suggestedQuestionCount,
}) => {
  if (
    [
      "simple_hint",
      "detailed_hint",
      "explanation",
      "worked_example",
      "revision_note",
      "code_tracing_steps",
      "retry_same_question",
    ].includes(supportAction)
  ) {
    return [];
  }

  return Question.find({
    concept,
    difficulty: recommendedNextDifficulty,
    _id: { $ne: currentQuestionId },
    isActive: true,
  })
    .limit(suggestedQuestionCount)
    .select("_id questionText options codeSnippet difficulty concept hint detailedHint explanation");
};

const runDifficultyAnalysis = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const {
      moduleId,
      questionId,
      concept,
      difficulty,
      selectedAnswer,
      correctAnswer,
      attemptNo,
      timeTakenSeconds,
      hintUsed,
      skipped,
      misconceptionTag,
    } = req.body;

    if (
      !questionId ||
      !concept ||
      !difficulty ||
      !selectedAnswer ||
      !correctAnswer
    ) {
      return res.status(400).json({
        success: false,
        message:
          "questionId, concept, difficulty, selectedAnswer and correctAnswer are required",
      });
    }

    const settings = await getOrCreateAISettings();

    if (!settings.enableDecisionQLearning) {
      return res.status(400).json({
        success: false,
        message: "Q-learning decision making is disabled by admin settings",
      });
    }

    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    const safeAttemptNo = Number(attemptNo) || 1;
    const safeTimeTakenSeconds = Number(timeTakenSeconds) || 0;
    const safeHintUsed = Boolean(hintUsed);
    const safeSkipped = Boolean(skipped);
    const isCorrect = selectedAnswer === correctAnswer;

    const pythonPayload = {
      student_id: studentId.toString(),
      question_id: questionId.toString(),
      module_id: moduleId || "",
      concept,
      difficulty,
      selected_answer: selectedAnswer,
      correct_answer: correctAnswer,
      attempt_no: safeAttemptNo,
      time_taken_seconds: safeTimeTakenSeconds,
      hint_used: safeHintUsed,
      skipped: safeSkipped,
      misconception_tag: misconceptionTag || "unknown",
    };

    const modelResult = await callPythonDifficultyModel(pythonPayload);

    const masteryLevel = normalizeMasteryLevel(modelResult.mastery_level);
    const bktMasteryProbability =
      Number(modelResult.bkt_mastery_probability) || 0;

    const recommendedSupportAction = normalizeSupportAction(
      modelResult.recommended_support_action
    );

    const recommendedNextDifficulty = normalizeDifficulty(
      modelResult.recommended_next_difficulty
    );

    const masteryRecord = await updateStudentMasteryFromModel({
      studentId,
      concept,
      bktMasteryProbability,
      masteryLevel,
      isCorrect,
      timeTakenSeconds: safeTimeTakenSeconds,
      hintUsed: safeHintUsed,
    });

    masteryRecord.lastRecommendedDifficulty =
      recommendedNextDifficulty === "unknown" ? "" : recommendedNextDifficulty;

    masteryRecord.lastSupportAction = recommendedSupportAction;
    masteryRecord.stuckCount += 1;

    await masteryRecord.save();

    const supportContent = buildSupportContent(
      recommendedSupportAction,
      question
    );

    const suggestedQuestionCount = settings.suggestedQuestionCount || 5;

    const recoveryQuestions = await getRecoveryQuestions({
      concept,
      currentQuestionId: questionId,
      supportAction: recommendedSupportAction,
      recommendedNextDifficulty,
      suggestedQuestionCount,
    });

    const decisionLog = await DecisionLog.create({
      student: studentId,
      module: moduleId || null,
      question: questionId,
      concept,
      currentDifficulty: difficulty,
      selectedAnswer,
      correctAnswer,
      isCorrect,
      attemptNo: safeAttemptNo,
      timeTakenSeconds: safeTimeTakenSeconds,
      hintUsed: safeHintUsed,
      misconceptionTag: misconceptionTag || "unknown",
      bktMasteryProbability,
      masteryLevel,
      recommendedNextDifficulty,
      recommendedSupportAction,
      modelState: {
        state: modelResult.state || {},
        q_state: modelResult.q_state || [],
        q_action: modelResult.q_action || recommendedSupportAction,
      },
      modelReward: Number(modelResult.reward) || 0,
      pythonRawResponse: modelResult,
    });

    return res.status(200).json({
      success: true,
      message: "Q-learning support decision completed",
      stuckAnalysis: {
        isStuck: Boolean(modelResult.is_stuck),
        concept,
        misconceptionTag: misconceptionTag || "unknown",
      },
      knowledgeAnalysis: {
        bktMasteryProbability,
        masteryLevel,
      },
      decisionMaking: {
        recommendedSupportAction,
        recommendedNextDifficulty,
        supportContent,
      },
      recoveryQuestions,
      decisionLogId: decisionLog._id,
      qLearning: {
        qState: modelResult.q_state || [],
        qAction: modelResult.q_action || recommendedSupportAction,
        rewardSeed: Number(modelResult.reward) || 0,
      },
    });
  } catch (error) {
    console.error("DIFFICULTY ANALYSIS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Q-learning support decision failed",
      error: error.message,
    });
  }
};

const calculateRewardFromRecovery = ({
  solvedAfterSupport,
  recoveryCorrect,
  timeImproved,
  attemptsReduced,
  neededExtraHint,
  skipped,
}) => {
  let reward = 0;

  if (solvedAfterSupport) reward += 10;
  if (recoveryCorrect) reward += 8;
  if (timeImproved) reward += 3;
  if (attemptsReduced) reward += 5;

  if (!solvedAfterSupport && !recoveryCorrect) reward -= 4;
  if (neededExtraHint) reward -= 2;
  if (skipped) reward -= 6;

  return reward;
};

const submitDecisionReward = async (req, res) => {
  try {
    const {
      decisionLogId,
      solvedAfterSupport,
      recoveryCorrect,
      timeImproved,
      attemptsReduced,
      neededExtraHint,
      skipped,
    } = req.body;

    if (!decisionLogId) {
      return res.status(400).json({
        success: false,
        message: "decisionLogId is required",
      });
    }

    const decisionLog = await DecisionLog.findById(decisionLogId);

    if (!decisionLog) {
      return res.status(404).json({
        success: false,
        message: "Decision log not found",
      });
    }

    const reward = calculateRewardFromRecovery({
      solvedAfterSupport,
      recoveryCorrect,
      timeImproved,
      attemptsReduced,
      neededExtraHint,
      skipped,
    });

    let pythonRewardResult = null;

    const qState = decisionLog.modelState?.q_state || [];
    const qAction =
      decisionLog.modelState?.q_action ||
      decisionLog.recommendedSupportAction;

    if (qState.length && qAction) {
      pythonRewardResult = await callPythonRewardModel({
        q_state: qState,
        q_action: qAction,
        reward,
      });
    }

    decisionLog.modelReward = reward;
    decisionLog.status =
      solvedAfterSupport || recoveryCorrect ? "completed" : "failed";
    decisionLog.pythonRawResponse = {
      ...decisionLog.pythonRawResponse,
      reward_update: pythonRewardResult,
    };

    await decisionLog.save();

    return res.status(200).json({
      success: true,
      message: "Q-learning reward updated",
      reward,
      pythonRewardResult,
      decisionLog,
    });
  } catch (error) {
    console.error("SUBMIT DECISION REWARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit Q-learning reward",
      error: error.message,
    });
  }
};

const getMyConceptMastery = async (req, res) => {
  try {
    const studentId = getStudentId(req);

    const mastery = await StudentConceptMastery.find({
      student: studentId,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      mastery,
    });
  } catch (error) {
    console.error("GET MY CONCEPT MASTERY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load concept mastery",
      error: error.message,
    });
  }
};

module.exports = {
  runDifficultyAnalysis,
  submitDecisionReward,
  getMyConceptMastery,
};