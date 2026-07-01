const mongoose = require("mongoose");

const readBySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const replySchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    audienceType: {
      type: String,
      enum: ["single", "all_students"],
      required: true,
      index: true,
    },

    subject: {
      type: String,
      default: "",
      trim: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    sentByRole: {
      type: String,
      enum: ["admin", "instructor"],
      required: true,
    },

    readBy: {
      type: [readBySchema],
      default: [],
    },

    replies: {
      type: [replySchema],
      default: [],
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipients: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);