const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Import Auth Middleware
const router = express.Router();

// ✅ User Login
router.post("/login", async (req, res) => {
    try {
        console.log("Login Request Body:", req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: user.role, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            email: user.email,   // ✅ Ensure this is included
            name: user.name,
            role: user.role,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        console.error("Server error:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Middleware to check if user is an Admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ msg: "Access denied: Admins only" });
        }
        next();
    } catch (err) {
        return res.status(500).json({ msg: "Authorization error" });
    }
};

// ✅ Admin: Add New User (Protected)
// ✅ Admin: Add New User (Protected)
router.post("/add-user", authMiddleware, isAdmin, async (req, res) => {
    try {
        const { name, email, password, role, isAdmin } = req.body;

        // Prevent duplicate email registration
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role, isAdmin });
        await newUser.save();

        res.json({ msg: "User added successfully" });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Admin: Get All Users (Protected)
router.get("/users", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude passwords
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ msg: "Server error" });
    }
});

// ✅ Admin: Reset Password (Protected)
// Reset Password Using Email
router.put("/reset-password", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password in database
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        res.json({ msg: "Password reset successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


module.exports = router;
