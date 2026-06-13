const mongoose = require("mongoose");

const questionAttemptSchema = new mongoose.Schema(
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

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D", "SKIPPED"],
      required: true,
    },

    isCorrect: {
      type: Boolean,
      required: true,
    },

    attemptNo: {
      type: Number,
      required: true,
      min: 1,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    hintUsed: {
      type: Boolean,
      default: false,
    },

    detailedHintUsed: {
      type: Boolean,
      default: false,
    },

    skipped: {
      type: Boolean,
      default: false,
    },

    isStuck: {
      type: Boolean,
      default: false,
      index: true,
    },

    stuckReason: {
      type: String,
      default: "",
    },

    misconceptionTag: {
      type: String,
      default: "",
      trim: true,
    },

    misconceptionExplanation: {
      type: String,
      default: "",
      trim: true,
    },

    masteryBefore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    masteryAfter: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    qLearningState: {
      type: String,
      default: "",
    },

    qLearningAction: {
      type: String,
      enum: [
        "",
        "simple_hint",
        "detailed_hint",
        "concept_explanation",
        "worked_example",
        "easier_question",
        "similar_question",
        "harder_challenge",
        "revision_note",
        "code_tracing_steps",
        "retry_same_question",
      ],
      default: "",
    },

    qLearningReward: {
      type: Number,
      default: 0,
    },

    recommendation: {
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
  },
  { timestamps: true }
);

questionAttemptSchema.index({ student: 1, module: 1, createdAt: -1 });
questionAttemptSchema.index({ student: 1, question: 1, attemptNo: 1 });

module.exports = mongoose.model("QuestionAttempt", questionAttemptSchema);