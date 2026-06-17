const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskGivingRoutes = require("./routes/taskGivingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const modelRewardRoutes = require("./routes/modelRewardRoutes");
const studentAnalyticsRoutes = require("./routes/studentAnalyticsRoutes");

// Only keep this if this file exists and exports router correctly
// const difficultyRoutes = require("./routes/difficultyRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://proflex-tutor.vercel.app",
  "https://proflex-tutor-akfyxc71l-jeyas-projects-999d4ec8.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// IMPORTANT:
// Do NOT add this:
// app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("ProgFlex API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/task-giving", taskGivingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/model", modelRewardRoutes);
app.use("/api/student/analytics", studentAnalyticsRoutes);

// Only enable if difficultyRoutes is correct
// app.use("/api/difficulty", difficultyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

module.exports = app;