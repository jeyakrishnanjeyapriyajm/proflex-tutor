const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // Actual active role used for permission
    role: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },

    // Role requested during registration
    requestedRole: {
      type: String,
      enum: ["user", "admin", "instructor"],
      default: "user",
    },

    // Approval status
    roleStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);