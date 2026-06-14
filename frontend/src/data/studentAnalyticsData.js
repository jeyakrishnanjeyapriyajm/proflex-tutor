export const studentAnalyticsMockData = {
  summary: {
    overallMastery: 76,
    accuracy: 82,
    completedModules: 5,
    totalModules: 18,
    totalAttempts: 148,
    studyTime: "24h 35m",
    streak: 12,
    currentLevel: "Intermediate",
  },

  conceptMastery: [
    {
      concept: "Basics",
      mastery: 96,
      status: "mastered",
      attempts: 18,
      accuracy: 94,
    },
    {
      concept: "Input / Output",
      mastery: 88,
      status: "strong",
      attempts: 21,
      accuracy: 86,
    },
    {
      concept: "Operators",
      mastery: 79,
      status: "good",
      attempts: 25,
      accuracy: 80,
    },
    {
      concept: "Control Structures",
      mastery: 68,
      status: "improving",
      attempts: 19,
      accuracy: 72,
    },
    {
      concept: "Loops",
      mastery: 54,
      status: "needs-practice",
      attempts: 16,
      accuracy: 61,
    },
    {
      concept: "Arrays",
      mastery: 42,
      status: "weak",
      attempts: 11,
      accuracy: 48,
    },
  ],

  weeklyActivity: [
    { day: "Mon", minutes: 45, questions: 12 },
    { day: "Tue", minutes: 60, questions: 18 },
    { day: "Wed", minutes: 35, questions: 9 },
    { day: "Thu", minutes: 75, questions: 22 },
    { day: "Fri", minutes: 50, questions: 14 },
    { day: "Sat", minutes: 90, questions: 26 },
    { day: "Sun", minutes: 40, questions: 10 },
  ],

  difficultyPerformance: [
    {
      level: "Easy",
      correct: 52,
      wrong: 8,
      accuracy: 87,
    },
    {
      level: "Medium",
      correct: 41,
      wrong: 12,
      accuracy: 77,
    },
    {
      level: "Hard",
      correct: 28,
      wrong: 17,
      accuracy: 62,
    },
  ],

  recentAttempts: [
    {
      id: 1,
      module: "Loops",
      difficulty: "Medium",
      score: "7/10",
      accuracy: 70,
      time: "12m 20s",
      status: "Completed",
    },
    {
      id: 2,
      module: "Operators",
      difficulty: "Hard",
      score: "6/10",
      accuracy: 60,
      time: "14m 05s",
      status: "Needs Review",
    },
    {
      id: 3,
      module: "Input / Output",
      difficulty: "Easy",
      score: "9/10",
      accuracy: 90,
      time: "08m 42s",
      status: "Completed",
    },
    {
      id: 4,
      module: "Control Structures",
      difficulty: "Medium",
      score: "8/10",
      accuracy: 80,
      time: "11m 10s",
      status: "Completed",
    },
  ],

  aiInsights: [
    {
      title: "Loops need more practice",
      description:
        "Your loop-related accuracy is lower than other topics. Focus on nested loops and termination conditions.",
      type: "warning",
    },
    {
      title: "Strong improvement in Operators",
      description:
        "Your recent attempts show better understanding of precedence and logical operators.",
      type: "success",
    },
    {
      title: "Recommended next module",
      description:
        "Continue with Arrays after revising Loops, because arrays depend on indexing and repeated traversal.",
      type: "info",
    },
  ],
};