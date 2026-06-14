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
      default: null,
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    currentDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    selectedAnswer: {
      type: String,
      default: "",
    },

    correctAnswer: {
      type: String,
      default: "",
    },

    isCorrect: {
      type: Boolean,
      default: false,
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

    masteryLevel: {
      type: String,
      enum: ["low", "medium", "high", "unknown"],
      default: "unknown",
    },

    recommendedNextDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "unknown"],
      default: "unknown",
    },

    recommendedSupportAction: {
      type: String,
      default: "unknown",
    },

    modelState: {
      type: Object,
      default: {},
    },

    modelReward: {
      type: Number,
      default: 0,
    },

    pythonRawResponse: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["recommended", "completed", "failed"],
      default: "recommended",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DecisionLog", decisionLogSchema);