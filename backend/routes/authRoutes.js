const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/authcontroller");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;