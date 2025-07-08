const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const analyticsRoutes = require("./routes/analytics");
const leaderboardRoutes = require("./routes/leaderboard");
const taskRoutes = require("./routes/taskRoutes");

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(express.json());

// ✅ CORS Configuration (allow multiple frontend origins)
const allowedOrigins = [
  "https://work-syncc.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ✅ Optional: Test route for health check
app.get("/api/auth/test", (req, res) => {
  res.json({ msg: "Auth route working ✅" });
});

// ✅ MongoDB Connection & Server Start
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => console.error("❌ MongoDB Connection Error:", err));
