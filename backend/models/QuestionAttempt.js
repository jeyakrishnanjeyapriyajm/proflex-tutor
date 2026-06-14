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
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
    },

    hintUsed: {
      type: Boolean,
      default: false,
    },

    isStuck: {
      type: Boolean,
      default: false,
    },

    misconceptionTag: {
      type: String,
      default: "unknown",
    },
  },
  { timestamps: true }
);

questionAttemptSchema.index({ student: 1, module: 1, question: 1 });
questionAttemptSchema.index({ question: 1, isCorrect: 1 });
questionAttemptSchema.index({ student: 1, question: 1 });

module.exports = mongoose.model("QuestionAttempt", questionAttemptSchema);