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
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB Connected");
        app.listen(process.env.PORT, () => console.log(`🚀 Server running on port ${process.env.PORT}`));
    })
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
