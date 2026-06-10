const mongoose = require("mongoose");

const studentModuleProgressSchema = new mongoose.Schema(
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

    currentOrderNo: {
      type: Number,
      default: 1,
    },

    score: {
      type: Number,
      default: 0,
    },

    completedQuestionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    status: {
      type: String,
      enum: ["not_started", "in_progress", "stuck", "completed"],
      default: "not_started",
    },

    stuckQuestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      default: null,
    },

    startedAt: {
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

module.exports = mongoose.model(
  "StudentModuleProgress",
  studentModuleProgressSchema
);