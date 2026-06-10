const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    misconceptionTag: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    orderNo: {
      type: Number,
      required: true,
    },

    questionText: {
      type: String,
      required: true,
    },

    codeSnippet: {
      type: String,
      default: "",
    },

    options: {
      type: [optionSchema],
      validate: {
        validator: (options) => options.length === 4,
        message: "Each MCQ must have exactly 4 options",
      },
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    hint: {
      type: String,
      default: "",
    },

    detailedHint: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    correctCount: {
      type: Number,
      default: 0,
    },

    attemptCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ module: 1, orderNo: 1 }, { unique: true });

module.exports = mongoose.model("Question", questionSchema);