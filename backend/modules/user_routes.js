const express = require("express");
const { getAllUsers, getStudents } = require("../controllers/usercontroller");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/all", protect, authorize("admin"), getAllUsers);
router.get("/students", protect, authorize("admin", "teacher"), getStudents);

module.exports = router;