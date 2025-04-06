const express = require("express");
const Task = require("../models/Task"); // Import the Task model
const User = require("../models/User"); // Assuming the User model is in models/User.js
const authMiddleware = require("../middleware/authMiddleware"); // Auth middleware to check JWT
const router = express.Router();
const mongoose = require("mongoose");

// Fetch tasks for the manager
router.get("/manager-tasks", authMiddleware, async (req, res) => {
    try {
        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.assignedTo) query.assignedTo = req.query.assignedTo;
        if (req.query.dueDate) query.dueDate = { $lte: new Date(req.query.dueDate) };

        const tasks = await Task.find(query).populate("assignedTo", "name email"); // Populate employee info
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});

// Assign task to an employee
router.post("/assign", authMiddleware, async (req, res) => {
    const { title, description, assignedTo, dueDate } = req.body;

    if (!title || !description || !assignedTo || !dueDate) {
        return res.status(400).json({ message: "Please provide all the required fields." });
    }

    try {
        // Create a new task
        const newTask = new Task({
            title,
            description,
            assignedTo,
            assignedBy: req.user.id,
            dueDate,
            status: "Pending", // Default status
        });

        // Save the task to the database
        await newTask.save();
        res.status(201).json(newTask); // Return the newly created task
    } catch (err) {
        console.error("Error assigning task:", err);
        res.status(500).json({ message: "Error assigning task" });
    }
});

// Delete task by ID
router.delete("/delete/:taskId", authMiddleware, async (req, res) => {
    const { taskId } = req.params;

    try {
        // Find and delete the task by ID
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ message: "Error deleting task" });
    }
});

// Update task status (Optional)
router.put("/update/:taskId", authMiddleware, async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Please provide a status." });
    }

    try {
        // Fetch task first
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.status = status;
        if (status === "Completed") {
            task.completedAt = new Date(); // Set completion timestamp
        } else {
            task.completedAt = null; // Reset if status is changed back
        }

        await task.save(); // Save the updated task

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: "Error updating task" });
    }
});


// Fetch tasks assigned to a specific employee (Optional)
// Fetch tasks assigned to an employee by email
router.get("/employee-tasks/:email", authMiddleware, async (req, res) => {
    const { email } = req.params;

    try {
        // Find user by email
        const user = await User.findOne({ email }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch tasks assigned to this user
        const tasks = await Task.find({ assignedTo: user._id }).populate("assignedBy", "name email");

        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found for this employee." });
        }

        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ message: "Error fetching tasks" });
    }
});


module.exports = router;
