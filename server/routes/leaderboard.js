const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const User = require("../models/User");

router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "manager") {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        const leaderboard = await Task.aggregate([
            {
                $match: { status: "Completed" },
            },
            {
                $group: {
                    _id: "$assignedTo",
                    completedTasks: { $sum: 1 },
                    avgCompletionTime: { $avg: "$completionTime" },
                },
            },
            { $sort: { completedTasks: -1, avgCompletionTime: 1 } },
        ]);

        const users = await User.find({ _id: { $in: leaderboard.map(l => l._id) } }).select("name");

        const leaderboardWithNames = leaderboard.map(entry => {
            const user = users.find(u => u._id.toString() === entry._id.toString());
            return {
                name: user ? user.name : "Unknown",
                completedTasks: entry.completedTasks,
                avgCompletionTime: entry.avgCompletionTime
                    ? entry.avgCompletionTime.toFixed(2)
                    : "N/A",
            };
        });

        res.json(leaderboardWithNames);
    } catch (err) {
        console.error("Error in /api/leaderboard:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
