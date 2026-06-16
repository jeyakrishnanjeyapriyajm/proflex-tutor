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
      min: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    hintUsedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const blockedQuestionLogSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    reason: {
      type: String,
      default: "",
    },

    supportAction: {
      type: String,
      default: "",
    },

    blockedAt: {
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

    /*
      Main question sequence stores only the normal main assessment questions.
      Recovery questions should not be stored here.
    */
    mainQuestionSequence: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    /*
      0 means first question in mainQuestionSequence.
      currentOrderNo is kept for UI/backward compatibility.
    */
    currentSequenceIndex: {
      type: Number,
      default: 0,
      min: 0,
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
      min: 0,
    },

    completedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    skippedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    hintUsedCount: {
      type: Number,
      default: 0,
      min: 0,
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

    /*
      Main questions blocked for this student.
      Example: explanation shown, so same main question should not be retried.
    */
    blockedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    blockedQuestionLogs: {
      type: [blockedQuestionLogSchema],
      default: [],
    },

    /*
      Recovery questions already shown to this student in this module.
      This prevents the same recovery question appearing again and again.
    */
    usedRecoveryQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    /*
      Review timer fields.
      Used when recovery practice fails.
      Student must review the concept for 5/10 minutes before retrying.
    */
    reviewUnlockAt: {
      type: Date,
      default: null,
    },

    reviewStartedAt: {
      type: Date,
      default: null,
    },

    reviewReason: {
      type: String,
      default: "",
    },

    reviewSupportAction: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "not_started",
        "in_progress",
        "stuck",
        "recovery",
        "needs_review",
        "completed",
      ],
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
      min: 0,
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
studentModuleProgressSchema.index({ student: 1, module: 1, currentOrderNo: 1 });
studentModuleProgressSchema.index({
  student: 1,
  module: 1,
  currentSequenceIndex: 1,
});

module.exports = mongoose.model(
  "StudentModuleProgress",
  studentModuleProgressSchema
);