const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

// Safe user id getter
const getLoggedInUserId = (req) => {
  return req.user?.id || req.user?._id;
};

// Create default student profile if not available
const createDefaultStudentProfile = async (userId) => {
  const profile = await StudentProfile.create({
    user: userId,

    studentId: `STU-${Date.now()}`,
    level: "First Year ICT",
    course: "C Programming Fundamentals",

    overallProgress: 58,
    totalXP: 1240,
    activeStreak: 12,
    completedModules: 5,
    totalModules: 10,
    completedMCQs: 84,
    timeSpentHours: 15,

    conceptMastery: [
      {
        concept: "C Basics",
        level: 90,
      },
      {
        concept: "Operators",
        level: 82,
      },
      {
        concept: "Conditional Statements",
        level: 75,
      },
      {
        concept: "Loops",
        level: 58,
      },
      {
        concept: "Arrays",
        level: 41,
      },
    ],

    recentActivities: [
      {
        title: "Nested For Loops",
        result: "Passed",
        time: "Today",
        type: "exercise",
      },
      {
        title: "Conditionals Assessment",
        result: "85%",
        time: "Yesterday",
        type: "quiz",
      },
      {
        title: "Array Indexing Practice",
        result: "Needs Review",
        time: "2 days ago",
        type: "practice",
      },
    ],

    resources: [
      {
        title: "C Basics Revision Note",
        type: "PDF",
        size: "2.4 MB",
        module: "C Basics",
      },
      {
        title: "Loop Tracing Practice",
        type: "Practice Task",
        size: "1.1 MB",
        module: "Loops",
      },
      {
        title: "Array Indexing Guide",
        type: "Guide",
        size: "900 KB",
        module: "Arrays",
      },
    ],

    messages: [
      {
        sender: "AI Tutor",
        message: "You need more practice in loop tracing.",
        time: "Today",
      },
      {
        sender: "Instructor",
        message: "Please complete the Arrays revision task.",
        time: "Yesterday",
      },
    ],

    achievements: [
      {
        name: "First Quiz",
        earned: true,
      },
      {
        name: "Loop Starter",
        earned: true,
      },
      {
        name: "Code Practice",
        earned: true,
      },
      {
        name: "Mastery Badge",
        earned: false,
      },
    ],
  });

  return profile;
};

// Student Dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user id missing",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let studentProfile = await StudentProfile.findOne({ user: userId });

    if (!studentProfile) {
      studentProfile = await createDefaultStudentProfile(userId);
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        requestedRole: user.requestedRole,
        roleStatus: user.roleStatus,
      },

      dashboard: {
        welcomeMessage: "Welcome to your student dashboard",
        studentId: studentProfile.studentId || "",
        level: studentProfile.level || "First Year ICT",
        course: studentProfile.course || "C Programming Fundamentals",

        overallProgress: studentProfile.overallProgress || 0,
        totalXP: studentProfile.totalXP || 0,
        activeStreak: studentProfile.activeStreak || 0,
        completedModules: studentProfile.completedModules || 0,
        totalModules: studentProfile.totalModules || 0,
        completedMCQs: studentProfile.completedMCQs || 0,
        timeSpentHours: studentProfile.timeSpentHours || 0,

        activeModule: "Loops",
        currentDifficulty: "Medium",
        nextRecommendation: "Practice loop tracing questions",
        learningStatus: "Needs support in Loops and Arrays",

        summaryCards: [
          {
            title: "Overall Progress",
            value: `${studentProfile.overallProgress || 0}%`,
          },
          {
            title: "Current Module",
            value: "Loops",
          },
          {
            title: "Current Level",
            value: "Medium",
          },
          {
            title: "Recommendation",
            value: "Detailed Hint",
          },
        ],

        conceptMastery: studentProfile.conceptMastery || [],
        recentActivities: studentProfile.recentActivities || [],
        resources: studentProfile.resources || [],
        messages: studentProfile.messages || [],
        achievements: studentProfile.achievements || [],
      },
    });
  } catch (error) {
    console.error("GET STUDENT DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student dashboard",
      error: error.message,
    });
  }
};

// Student Analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user id missing",
      });
    }

    let studentProfile = await StudentProfile.findOne({ user: userId });

    if (!studentProfile) {
      studentProfile = await createDefaultStudentProfile(userId);
    }

    return res.status(200).json({
      success: true,
      analytics: {
        predictiveScore: "B+",
        overallProgress: studentProfile.overallProgress || 0,

        moduleCompletion: [
          {
            module: "C Basics",
            progress: 90,
          },
          {
            module: "Operators",
            progress: 82,
          },
          {
            module: "Conditions",
            progress: 75,
          },
          {
            module: "Loops",
            progress: 58,
          },
          {
            module: "Arrays",
            progress: 41,
          },
        ],

        masteryTrends: studentProfile.conceptMastery || [],

        weakAreas: (studentProfile.conceptMastery || []).filter(
          (item) => item.level < 60
        ),

        insights: [
          "Student performs well in basic syntax.",
          "Loop tracing needs more practice.",
          "Arrays concept requires additional support.",
        ],
      },
    });
  } catch (error) {
    console.error("GET STUDENT ANALYTICS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student analytics",
      error: error.message,
    });
  }
};

// Student Workspace
const getStudentWorkspace = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      workspace: {
        currentTask: {
          title: "Loop Practice Task",
          concept: "Loops",
          difficulty: "Medium",
          instruction:
            "Write a C program to print numbers from 1 to 10 using a for loop.",
          starterCode:
            '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
        },

        savedWorkspaces: [
          {
            title: "If Statement Practice",
            lastEdited: "Yesterday",
          },
          {
            title: "Nested Loop Example",
            lastEdited: "2 days ago",
          },
        ],

        hints: [
          "Use a for loop.",
          "Initialize i = 1.",
          "The loop should run while i <= 10.",
        ],
      },
    });
  } catch (error) {
    console.error("GET STUDENT WORKSPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student workspace",
      error: error.message,
    });
  }
};

// Student Curriculum
const getStudentCurriculum = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      curriculum: {
        course: "C Programming Fundamentals",

        modules: [
          {
            moduleNo: 1,
            title: "Introduction to C",
            outcome: "Understand the structure of a C program.",
            progress: 100,
          },
          {
            moduleNo: 2,
            title: "Variables and Data Types",
            outcome: "Use variables and data types correctly.",
            progress: 86,
          },
          {
            moduleNo: 3,
            title: "Operators",
            outcome: "Apply arithmetic, relational, and logical operators.",
            progress: 75,
          },
          {
            moduleNo: 4,
            title: "Conditional Statements",
            outcome: "Use if, else-if, and switch statements.",
            progress: 72,
          },
          {
            moduleNo: 5,
            title: "Loops",
            outcome: "Apply for, while, and do-while loops.",
            progress: 58,
          },
          {
            moduleNo: 6,
            title: "Arrays",
            outcome: "Use one-dimensional arrays.",
            progress: 41,
          },
        ],
      },
    });
  } catch (error) {
    console.error("GET STUDENT CURRICULUM ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student curriculum",
      error: error.message,
    });
  }
};

// Student Assessment
const getStudentAssessment = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      assessment: {
        activeModule: "Loops",
        quizStructure: "10 MCQs arranged from easy to hard",

        quizzes: [
          {
            module: "Variables and Data Types",
            status: "Completed",
            score: 86,
          },
          {
            module: "Conditional Statements",
            status: "Completed",
            score: 72,
          },
          {
            module: "Loops",
            status: "In Progress",
            score: 58,
          },
          {
            module: "Arrays",
            status: "Needs Review",
            score: 41,
          },
        ],

        feedback: [
          "Student is struggling with loop tracing.",
          "More practice needed for array indexing.",
          "Hints helped improve conditional statement performance.",
        ],
      },
    });
  } catch (error) {
    console.error("GET STUDENT ASSESSMENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student assessment",
      error: error.message,
    });
  }
};

// Student Resources
const getStudentResources = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user id missing",
      });
    }

    let studentProfile = await StudentProfile.findOne({ user: userId });

    if (!studentProfile) {
      studentProfile = await createDefaultStudentProfile(userId);
    }

    return res.status(200).json({
      success: true,
      resources: studentProfile.resources || [],
    });
  } catch (error) {
    console.error("GET STUDENT RESOURCES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student resources",
      error: error.message,
    });
  }
};

// Student Messages
const getStudentMessages = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user id missing",
      });
    }

    let studentProfile = await StudentProfile.findOne({ user: userId });

    if (!studentProfile) {
      studentProfile = await createDefaultStudentProfile(userId);
    }

    return res.status(200).json({
      success: true,
      messages: studentProfile.messages || [],

      notifications: [
        {
          title: "New support recommendation",
          message: "A detailed hint is available for Loops.",
          time: "5 minutes ago",
        },
        {
          title: "Progress update",
          message: "Your C Basics module is fully completed.",
          time: "Yesterday",
        },
      ],
    });
  } catch (error) {
    console.error("GET STUDENT MESSAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student messages",
      error: error.message,
    });
  }
};

// Student Settings
const getStudentSettings = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user id missing",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      settings: {
        name: user.name,
        email: user.email,
        role: user.role,
        roleStatus: user.roleStatus,

        notifications: {
          email: true,
          dashboard: true,
          weeklyReport: true,
        },

        privacy: {
          showProgressToLecturer: true,
        },
      },
    });
  } catch (error) {
    console.error("GET STUDENT SETTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load student settings",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
  getStudentAnalytics,
  getStudentWorkspace,
  getStudentCurriculum,
  getStudentAssessment,
  getStudentResources,
  getStudentMessages,
  getStudentSettings,
};