const mongoose = require("mongoose");

const studentConceptMasterySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    concept: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    masteryProbability: {
      type: Number,
      default: 0.3,
      min: 0,
      max: 1,
    },

    masteryLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    totalAttempts: {
      type: Number,
      default: 0,
    },

    correctAttempts: {
      type: Number,
      default: 0,
    },

    wrongAttempts: {
      type: Number,
      default: 0,
    },

    hintUsedCount: {
      type: Number,
      default: 0,
    },

    explanationShownCount: {
      type: Number,
      default: 0,
    },

    stuckCount: {
      type: Number,
      default: 0,
    },

    averageTimeSeconds: {
      type: Number,
      default: 0,
    },

    lastRecommendedDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard", ""],
      default: "",
    },

    lastSupportAction: {
      type: String,
      default: "",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

studentConceptMasterySchema.index(
  { student: 1, concept: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "StudentConceptMastery",
  studentConceptMasterySchema
);