const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["manager", "employee"], required: true },
    isAdmin: { type: Boolean, default: false }  // Admins can manage users
});

module.exports = mongoose.model("User", UserSchema);
