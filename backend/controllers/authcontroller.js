const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      roleStatus: user.roleStatus,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("REGISTER BODY:", req.body);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const requestedRole = role || "user";

    let finalRole = "user";
    let roleStatus = "approved";

    // Instructor must be approved by admin
    if (requestedRole === "instructor") {
      finalRole = "user";
      roleStatus = "pending";
    }

    // Normal user approved automatically
    if (requestedRole === "user") {
      finalRole = "user";
      roleStatus = "approved";
    }

    // Do not allow public admin registration
    if (requestedRole === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be created from public registration",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: finalRole,
      requestedRole,
      roleStatus,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message:
        roleStatus === "pending"
          ? "Registration successful. Instructor account is pending admin approval."
          : "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        requestedRole: newUser.requestedRole,
        roleStatus: newUser.roleStatus,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Profile failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};