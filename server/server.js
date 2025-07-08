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

app.use(express.json());

// ✅ CORS configuration
const allowedOrigin = "https://work-sync-hts3maj2y-hritesh-roshan-mahapatras-projects.vercel.app";
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.options("*", cors({
  origin: allowedOrigin,
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
