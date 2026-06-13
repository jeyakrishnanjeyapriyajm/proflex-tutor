const mongoose = require("mongoose");

const conceptMasterySchema = new mongoose.Schema(
  {
    concept: {
      type: String,
      required: true,
      trim: true,
    },

    masteryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    masteryLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    hintUsedCount: {
      type: Number,
      default: 0,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const studentModuleProgressSchema = new mongoose.Schema(
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
      index: true,
    },

    currentOrderNo: {
      type: Number,
      default: 1,
      min: 1,
    },

    currentQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    completedCount: {
      type: Number,
      default: 0,
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
    },

    skippedCount: {
      type: Number,
      default: 0,
    },

    hintUsedCount: {
      type: Number,
      default: 0,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    overallMasteryScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    overallMasteryLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    conceptMastery: {
      type: [conceptMasterySchema],
      default: [],
    },

    completedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    wrongQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    skippedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    status: {
      type: String,
      enum: ["not_started", "in_progress", "stuck", "completed"],
      default: "not_started",
      index: true,
    },

    stuckQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    lastRecommendation: {
      action: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        default: "",
      },

      nextQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        default: null,
      },
    },

    totalTimeSpentSeconds: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    lastActivityAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

studentModuleProgressSchema.index(
  { student: 1, module: 1 },
  { unique: true }
);

studentModuleProgressSchema.index({ student: 1, status: 1 });
studentModuleProgressSchema.index({ module: 1, status: 1 });

module.exports = mongoose.model(
  "StudentModuleProgress",
  studentModuleProgressSchema
);