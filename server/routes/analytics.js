const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Task = require("../models/Task");

// 📌 API to fetch performance analytics with employee name and avg completion time
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "manager") {
            return res.status(403).json({ message: "Access denied. Managers only." });
        }

        const analyticsData = await Task.aggregate([
            // Step 1: Add a computed field for completion time (in days)
            {
                $addFields: {
                    completionTime: {
                        $cond: [
                            { $eq: ["$status", "Completed"] },
                            {
                                $divide: [
                                    { $subtract: ["$completedAt", "$createdAt"] },
                                    1000 * 60 * 60 * 24 // Convert ms to days
                                ]
                            },
                            null
                        ]
                    }
                }
            },
            // Step 2: Group by employee
            {
                $group: {
                    _id: "$assignedTo",
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Completed"] }, 1, 0]
                        }
                    },
                    avgCompletionTime: { $avg: "$completionTime" }
                }
            },
            // Step 3: Join with user info
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo"
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Step 4: Final output structure
            {
                $project: {
                    _id: 0,
                    employeeId: "$userInfo._id",
                    employeeName: "$userInfo.name",
                    totalTasks: 1,
                    completedTasks: 1,
                    avgCompletionTime: { $round: ["$avgCompletionTime", 2] }
                }
            }
        ]);

        res.json(analyticsData);
    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
