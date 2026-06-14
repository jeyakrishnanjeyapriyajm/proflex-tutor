const mongoose = require("mongoose");

const decisionLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
    },

    isCorrect: {
      type: Boolean,
      default: false,
    },

    isStuck: {
      type: Boolean,
      default: false,
    },

    stuckReason: {
      type: String,
      default: "",
    },

    selectedAnswer: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      default: "",
    },

    attemptNo: {
      type: Number,
      default: 1,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
    },

    hintUsed: {
      type: Boolean,
      default: false,
    },

    misconceptionTag: {
      type: String,
      default: "unknown",
    },

    bktMasteryProbability: {
      type: Number,
      default: 0,
    },

    behaviorMasteryProbability: {
      type: Number,
      default: 0,
    },

    finalMasteryProbability: {
      type: Number,
      default: 0,
    },

    masteryLevel: {
      type: String,
      enum: ["low", "medium", "high", "unknown"],
      default: "unknown",
    },

    recommendedSupportAction: {
      type: String,
      default: "",
    },

    recommendedNextDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "unknown"],
      default: "unknown",
    },

    qState: {
      type: Array,
      default: [],
    },

    qAction: {
      type: String,
      default: "",
    },

    reward: {
      type: Number,
      default: 0,
    },

    pythonRawResponse: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["recommended", "reward_updated", "completed"],
      default: "recommended",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DecisionLog", decisionLogSchema);