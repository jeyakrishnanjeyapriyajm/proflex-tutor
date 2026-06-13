const mongoose = require("mongoose");

const questionAttemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    selectedAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
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
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionAttempt", questionAttemptSchema);