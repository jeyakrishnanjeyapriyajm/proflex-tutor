export const studentDashboardMockData = {
  user: {
    name: "Kogulan K.",
    role: "First Year ICT",
    avatar: "https://picsum.photos/seed/user/200/200",
  },

  dashboard: {
    courseTitle: "C Programming Fundamentals",
    completion: 42,
    xp: 1240,
    streak: "12 Days",
    level: 14,
    completedModules: 12,
    totalModules: 28,
    exercises: 84,
    timeSpent: "15h",

    resumeLearning: {
      title: "Ready to Code?",
      module: "Loops (For/While/Do)",
      bonusXp: 50,
      buttonText: "Resume Workspace",
    },

    conceptMastery: [
      { concept: "Variables & Data Types", level: 92 },
      { concept: "Conditional Statements", level: 78 },
      { concept: "Loops", level: 65 },
      { concept: "Arrays", level: 42 },
    ],

    recentActivities: [
      {
        type: "exercise",
        title: "Nested For Loops",
        result: "Passed",
        time: "Today, 10:42 AM",
      },
      {
        type: "quiz",
        title: "Conditionals Assessment",
        result: "85%",
        time: "Yesterday, 4:15 PM",
      },
      {
        type: "badge",
        title: "Logic Master Badge",
        result: "Unlocked",
        time: "Mar 1, 2:30 PM",
      },
    ],

    resources: [
      {
        title: "Introduction to C Arrays.pdf",
        type: "PDF",
        size: "2.4 MB",
      },
      {
        title: "Loop Tracing Example.mp4",
        type: "Video",
        size: "45 MB",
      },
    ],

    messages: [
      {
        name: "Instructor",
        time: "10:24 AM",
        message: "Your loop practice is improving. Review nested loop tracing again.",
        avatar: "https://picsum.photos/seed/instructor/100/100",
      },
      {
        name: "ProgFlex Support",
        time: "Yesterday",
        message: "Your latest mastery report is now available.",
        avatar: "https://picsum.photos/seed/support/100/100",
      },
    ],

    achievements: [
      { id: 1, name: "First Quiz", earned: true },
      { id: 2, name: "Loop Starter", earned: true },
      { id: 3, name: "Code Practice", earned: true },
      { id: 4, name: "Logic Master", earned: true },
      { id: 5, name: "Array Expert", earned: false },
      { id: 6, name: "Pointer Pro", earned: false },
      { id: 7, name: "Debug King", earned: false },
      { id: 8, name: "Final Master", earned: false },
    ],

    notifications: [
      {
        id: 1,
        title: "New Lesson Available",
        message: "Module 5: Multidimensional Arrays is now open.",
        time: "2m ago",
        read: false,
        type: "lesson",
      },
      {
        id: 2,
        title: "Quiz Completed",
        message: "Your Loops MCQ practice was submitted successfully.",
        time: "1h ago",
        read: true,
        type: "success",
      },
      {
        id: 3,
        title: "AI Support Updated",
        message: "New hint recommendations are available for Arrays.",
        time: "5h ago",
        read: true,
        type: "system",
      },
    ],
  },
};