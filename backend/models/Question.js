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

const questionDifficultyStatsSchema = new mongoose.Schema(
  {
    correctRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    wrongRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    hintRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    stuckRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    averageTimeSeconds: {
      type: Number,
      default: 0,
    },

    expectedTimeSeconds: {
      type: Number,
      default: 0,
    },

    timeStruggleRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    sampleSize: {
      type: Number,
      default: 0,
    },

    lastCalculatedAt: {
      type: Date,
      default: null,
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
    

    // Lecturer/admin initial difficulty
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    // System-calculated difficulty from previous student performance
    dynamicDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "not_enough_data"],
      default: "not_enough_data",
    },

    // Final difficulty used by reports/model after enough attempts
    effectiveDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: undefined,
    },

    difficultyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },

    difficultySource: {
      type: String,
      enum: ["lecturer", "system"],
      default: "lecturer",
    },

    minimumAttemptsForDynamicDifficulty: {
      type: Number,
      default: 20,
    },

    difficultyStats: {
      type: questionDifficultyStatsSchema,
      default: () => ({}),
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
questionSchema.index({ concept: 1, difficulty: 1 });
questionSchema.index({ concept: 1, dynamicDifficulty: 1 });
questionSchema.index({ concept: 1, effectiveDifficulty: 1 });

// Do not use next() here
questionSchema.pre("save", function () {
  if (!this.effectiveDifficulty) {
    this.effectiveDifficulty = this.difficulty;
  }
});

module.exports = mongoose.model("Question", questionSchema);