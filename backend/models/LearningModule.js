const mongoose = require("mongoose");

const learningModuleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Module title is required"],
      trim: true,
    },

    name: {
      type: String,
      required: [true, "Module name is required"],
      trim: true,
    },

    code: {
      type: String,
      required: [true, "Module code is required"],
      trim: true,
      unique: true,
      uppercase: true,
    },

    slug: {
      type: String,
      required: [true, "Module slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      default: "",
    },

    explanation: {
      type: String,
      default: "",
    },

    learningObjectives: {
      type: [String],
      default: [],
    },

    concepts: {
      type: [String],
      default: [],
    },

    difficultyPath: {
      type: [String],
      enum: ["easy", "medium", "hard"],
      default: ["easy", "medium", "hard"],
    },

    estimatedTime: {
      type: String,
      default: "30 minutes",
    },

    totalQuestions: {
      type: Number,
      default: 10,
    },

    orderNo: {
      type: Number,
      required: true,
      index: true,
    },

    icon: {
      type: String,
      default: "BookOpen",
    },

    color: {
      type: String,
      default: "blue",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

learningModuleSchema.index({ orderNo: 1 });
learningModuleSchema.index({ code: 1 });
learningModuleSchema.index({ slug: 1 });

module.exports = mongoose.model("LearningModule", learningModuleSchema);