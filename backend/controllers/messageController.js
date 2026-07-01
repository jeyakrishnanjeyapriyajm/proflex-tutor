const Message = require("../models/Message");
const User = require("../models/User");

const getUserId = (req) => {
  return req.user?._id || req.user?.id;
};

const isStaff = (user) => {
  return user?.role === "admin" || user?.role === "instructor";
};

/**
 * GET /api/messages/students
 * Admin / Lecturer can get all students for message dropdown.
 */
const getMessageStudents = async (req, res) => {
  try {
    if (!isStaff(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin or lecturer can view students.",
      });
    }

    const students = await User.find({ role: "user" })
      .select("_id name email role")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("GET MESSAGE STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load students.",
      error: error.message,
    });
  }
};

/**
 * GET /api/messages/sent
 * Admin / Lecturer can view messages they sent.
 */
const getSentMessages = async (req, res) => {
  try {
    const senderId = getUserId(req);

    if (!isStaff(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin or lecturer can view sent messages.",
      });
    }

    const messages = await Message.find({ sender: senderId })
      .populate("sender", "name email role")
      .populate("recipients", "name email role")
      .populate("replies.sender", "name email role")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("GET SENT MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load sent messages.",
      error: error.message,
    });
  }
};

/**
 * POST /api/messages/send
 * Admin / Lecturer sends message to one student or all students.
 *
 * Body:
 * {
 *   audienceType: "single" | "all_students",
 *   recipientId: "studentId", // required only for single
 *   subject: "optional subject",
 *   body: "message body"
 * }
 */
const sendMessage = async (req, res) => {
  try {
    const senderId = getUserId(req);
    const { audienceType, recipientId, subject, body } = req.body;

    if (!isStaff(req.user)) {
      return res.status(403).json({
        success: false,
        message: "Only admin or lecturer can send messages.",
      });
    }

    if (!body || !body.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message body is required.",
      });
    }

    if (!["single", "all_students"].includes(audienceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid audience type.",
      });
    }

    if (audienceType === "single") {
      if (!recipientId) {
        return res.status(400).json({
          success: false,
          message: "Student is required.",
        });
      }

      const student = await User.findOne({
        _id: recipientId,
        role: "user",
      })
        .select("_id name email role")
        .lean();

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      const message = await Message.create({
        sender: senderId,
        recipients: [recipientId],
        audienceType: "single",
        subject: subject || "",
        body: body.trim(),
        sentByRole: req.user.role,
        readBy: [],
        replies: [],
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email role")
        .populate("recipients", "name email role")
        .lean();

      return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        data: populatedMessage,
      });
    }

    if (audienceType === "all_students") {
      const students = await User.find({ role: "user" }).select("_id").lean();

      if (!students.length) {
        return res.status(404).json({
          success: false,
          message: "No students found.",
        });
      }

      const recipientIds = students.map((student) => student._id);

      const message = await Message.create({
        sender: senderId,
        recipients: recipientIds,
        audienceType: "all_students",
        subject: subject || "",
        body: body.trim(),
        sentByRole: req.user.role,
        readBy: [],
        replies: [],
      });

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email role")
        .populate("recipients", "name email role")
        .lean();

      return res.status(201).json({
        success: true,
        message: `Message sent to ${recipientIds.length} students.`,
        count: recipientIds.length,
        data: populatedMessage,
      });
    }
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error: error.message,
    });
  }
};

/**
 * GET /api/messages/my
 * Student can view messages received from admin / lecturer.
 */
const getMyMessages = async (req, res) => {
  try {
    const userId = getUserId(req);

    const messages = await Message.find({
      recipients: userId,
    })
      .populate("sender", "name email role")
      .populate("recipients", "name email role")
      .populate("replies.sender", "name email role")
      .sort({ createdAt: -1 })
      .lean();

    const mappedMessages = messages.map((message) => {
      const readInfo = message.readBy?.find(
        (item) => String(item.user) === String(userId)
      );

      return {
        ...message,
        isRead: Boolean(readInfo),
        readAt: readInfo?.readAt || null,
      };
    });

    return res.status(200).json({
      success: true,
      messages: mappedMessages,
    });
  } catch (error) {
    console.error("GET MY MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load your messages.",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/messages/:messageId/read
 * Student marks message as read.
 */
const markMessageAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { messageId } = req.params;

    const message = await Message.findOne({
      _id: messageId,
      recipients: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    const alreadyRead = message.readBy.some(
      (item) => String(item.user) === String(userId)
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: userId,
        readAt: new Date(),
      });

      await message.save();
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read.",
    });
  } catch (error) {
    console.error("MARK MESSAGE READ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark message as read.",
      error: error.message,
    });
  }
};

/**
 * POST /api/messages/:messageId/reply
 * Student replies to message.
 *
 * Body:
 * {
 *   body: "reply message"
 * }
 */
const replyToMessage = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { messageId } = req.params;
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply body is required.",
      });
    }

    const message = await Message.findOne({
      _id: messageId,
      recipients: userId,
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    message.replies.push({
      sender: userId,
      body: body.trim(),
      createdAt: new Date(),
    });

    await message.save();

    const updatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role")
      .populate("recipients", "name email role")
      .populate("replies.sender", "name email role")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Reply sent successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("REPLY MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send reply.",
      error: error.message,
    });
  }
};

module.exports = {
  getMessageStudents,
  getSentMessages,
  sendMessage,
  getMyMessages,
  markMessageAsRead,
  replyToMessage,
};