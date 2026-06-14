const mongoose = require("mongoose");

const aiModelSettingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "default",
      unique: true,
    },

    enableBKT: {
      type: Boolean,
      default: true,
    },

    enableDifficultyRL: {
      type: Boolean,
      default: true,
    },

    enableDecisionQLearning: {
      type: Boolean,
      default: true,
    },

    maxWrongAttemptsBeforeModel: {
      type: Number,
      default: 3,
    },

    firstWrongAction: {
      type: String,
      default: "hint",
    },

    secondWrongAction: {
      type: String,
      default: "explanation",
    },

    thirdWrongAction: {
      type: String,
      default: "difficulty_analysis",
    },

    expectedTimeSeconds: {
      easy: {
        type: Number,
        default: 45,
      },
      medium: {
        type: Number,
        default: 90,
      },
      hard: {
        type: Number,
        default: 150,
      },
    },

    suggestedQuestionCount: {
      type: Number,
      default: 5,
    },

    suggestedRoundPassCount: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AIModelSetting", aiModelSettingSchema);