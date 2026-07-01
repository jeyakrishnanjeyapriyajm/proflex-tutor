const express = require("express");

const {
  getMessageStudents,
  getSentMessages,
  sendMessage,
  getMyMessages,
  markMessageAsRead,
  replyToMessage,
} = require("../controllers/messageController");

const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/students", protect, getMessageStudents);
router.get("/sent", protect, getSentMessages);
router.post("/send", protect, sendMessage);

router.get("/my", protect, getMyMessages);
router.patch("/:messageId/read", protect, markMessageAsRead);
router.post("/:messageId/reply", protect, replyToMessage);

module.exports = router;