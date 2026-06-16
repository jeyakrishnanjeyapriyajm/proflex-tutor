const express = require("express");
const cors = require("cors");
const modelRewardRoutes = require("./routes/modelRewardRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/task-giving", taskGivingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/difficulty", difficultyRoutes);


app.use("/api/model", modelRewardRoutes);

app.get("/", (req, res) => {
  res.send("ProgFlex API is running");
});

export default app;