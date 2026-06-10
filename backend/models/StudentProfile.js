const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    studentId: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      default: "First Year ICT",
    },

    course: {
      type: String,
      default: "C Programming Fundamentals",
    },

    overallProgress: {
      type: Number,
      default: 0,
    },

    totalXP: {
      type: Number,
      default: 0,
    },

    activeStreak: {
      type: Number,
      default: 0,
    },

    completedModules: {
      type: Number,
      default: 0,
    },

    totalModules: {
      type: Number,
      default: 10,
    },

    completedMCQs: {
      type: Number,
      default: 0,
    },

    timeSpentHours: {
      type: Number,
      default: 0,
    },

    conceptMastery: [
      {
        concept: {
          type: String,
          required: true,
        },
        level: {
          type: Number,
          default: 0,
        },
      },
    ],

    recentActivities: [
      {
        title: String,
        result: String,
        time: String,
        type: String,
      },
    ],

    resources: [
      {
        title: String,
        type: String,
        size: String,
      },
    ],

    messages: [
      {
        sender: String,
        message: String,
        time: String,
      },
    ],

    achievements: [
      {
        name: String,
        earned: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);