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
      trim: true,
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
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LearningModule",
      required: true,
      index: true,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
    },

    subConcept: {
      type: String,
      default: "",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
      index: true,
    },

    dynamicDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    orderNo: {
      type: Number,
      required: true,
    },

    questionType: {
      type: String,
      enum: ["mcq", "code-tracing", "debugging", "concept"],
      default: "mcq",
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    codeSnippet: {
      type: String,
      default: "",
    },

    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: function (options) {
          return Array.isArray(options) && options.length === 4;
        },
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

    workedExample: {
      type: String,
      default: "",
    },

    tracingSteps: {
      type: [String],
      default: [],
    },

    expectedTime: {
      type: Number,
      default: 60,
    },

    tags: {
      type: [String],
      default: [],
    },

    statistics: {
      attemptCount: {
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

      difficultyIndex: {
        type: Number,
        default: 0,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

questionSchema.index({ module: 1, orderNo: 1 }, { unique: true });
questionSchema.index({ module: 1, difficulty: 1 });
questionSchema.index({ module: 1, concept: 1 });
questionSchema.index({ isActive: 1 });

module.exports = mongoose.model("Question", questionSchema);