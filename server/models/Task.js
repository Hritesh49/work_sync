const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Employee ID
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Manager ID
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    dueDate: { type: Date, required: true },
    completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Task", TaskSchema);

