const Question = require("../models/Question");
const QuestionAttempt = require("../models/QuestionAttempt");

const EXPECTED_TIME_SECONDS = {
  easy: 45,
  medium: 90,
  hard: 150,
};

const round2 = (value) => {
  return Number(Number(value || 0).toFixed(2));
};

const clamp01 = (value) => {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
};

const classifyDifficultyFromScore = (difficultyScore) => {
  if (difficultyScore < 0.35) return "easy";
  if (difficultyScore < 0.65) return "medium";
  return "hard";
};

const calculateQuestionDifficulty = async (questionId) => {
  const question = await Question.findById(questionId);

  if (!question) {
    throw new Error("Question not found");
  }

  const attempts = await QuestionAttempt.find({
    question: questionId,
  }).select("isCorrect timeTakenSeconds hintUsed isStuck");

  const sampleSize = attempts.length;

  if (sampleSize === 0) {
    question.dynamicDifficulty = "not_enough_data";
    question.effectiveDifficulty = question.difficulty;
    question.difficultySource = "lecturer";
    question.difficultyScore = 0;

    question.difficultyStats = {
      correctRate: 0,
      wrongRate: 0,
      hintRate: 0,
      stuckRate: 0,
      averageTimeSeconds: 0,
      expectedTimeSeconds: EXPECTED_TIME_SECONDS[question.difficulty] || 90,
      timeStruggleRate: 0,
      confidence: 0,
      sampleSize: 0,
      lastCalculatedAt: new Date(),
    };

    await question.save();
    return question;
  }

  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const hintCount = attempts.filter((a) => a.hintUsed).length;
  const stuckCount = attempts.filter((a) => a.isStuck).length;

  const totalTime = attempts.reduce((sum, attempt) => {
    return sum + (Number(attempt.timeTakenSeconds) || 0);
  }, 0);

  const averageTimeSeconds = totalTime / sampleSize;
  const expectedTimeSeconds = EXPECTED_TIME_SECONDS[question.difficulty] || 90;

  const correctRate = correctCount / sampleSize;
  const wrongRate = 1 - correctRate;
  const hintRate = hintCount / sampleSize;
  const stuckRate = stuckCount / sampleSize;
  const timeStruggleRate = clamp01(
    averageTimeSeconds / (expectedTimeSeconds * 2)
  );

  const difficultyScore =
    wrongRate * 0.6 +
    timeStruggleRate * 0.15 +
    hintRate * 0.15 +
    stuckRate * 0.1;

  const dynamicDifficulty = classifyDifficultyFromScore(difficultyScore);

  const confidence = clamp01(
    sampleSize / Number(question.minimumAttemptsForDynamicDifficulty || 20)
  );

  question.correctCount = correctCount;
  question.attemptCount = sampleSize;
  question.difficultyScore = round2(difficultyScore);
  question.dynamicDifficulty = dynamicDifficulty;

  question.difficultyStats = {
    correctRate: round2(correctRate),
    wrongRate: round2(wrongRate),
    hintRate: round2(hintRate),
    stuckRate: round2(stuckRate),
    averageTimeSeconds: Math.round(averageTimeSeconds),
    expectedTimeSeconds,
    timeStruggleRate: round2(timeStruggleRate),
    confidence: round2(confidence),
    sampleSize,
    lastCalculatedAt: new Date(),
  };

  if (sampleSize >= Number(question.minimumAttemptsForDynamicDifficulty || 20)) {
    question.effectiveDifficulty = dynamicDifficulty;
    question.difficultySource = "system";
  } else {
    question.effectiveDifficulty = question.difficulty;
    question.difficultySource = "lecturer";
  }

  await question.save();

  return question;
};

const recalculateAllQuestionDifficulties = async () => {
  const questions = await Question.find({ isActive: true }).select("_id");

  const results = [];

  for (const question of questions) {
    const updatedQuestion = await calculateQuestionDifficulty(question._id);

    results.push({
      questionId: updatedQuestion._id,
      difficulty: updatedQuestion.difficulty,
      dynamicDifficulty: updatedQuestion.dynamicDifficulty,
      effectiveDifficulty: updatedQuestion.effectiveDifficulty,
      difficultyScore: updatedQuestion.difficultyScore,
      difficultySource: updatedQuestion.difficultySource,
      sampleSize: updatedQuestion.difficultyStats?.sampleSize || 0,
    });
  }

  return results;
};

module.exports = {
  calculateQuestionDifficulty,
  recalculateAllQuestionDifficulties,
};