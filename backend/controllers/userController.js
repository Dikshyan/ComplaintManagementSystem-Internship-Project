const bcrypt = require("bcryptjs");
const { userModel } = require("../models/user.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Fetch users error:", error);
    return res.status(500).json({ message: "Failed to fetch users." });
  }
};

const createStaffUser = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    const existingUser = await userModel.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const staffUser = await userModel.create({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: "staff",
      department: department || "General Municipal Services"
    });

    return res.status(201).json({
      message: "Staff account created successfully.",
      user: staffUser.toPublicJSON()
    });
  } catch (error) {
    console.error("Create staff user error:", error);
    return res.status(400).json({ message: error.message || "Failed to create staff account." });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = ["name", "phoneNumber", "profileImage"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided to update."
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      updates,
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Profile updated.",
      user: updatedUser.toPublicJSON()
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Failed to update profile."
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const allowedRoles = ["user", "staff", "admin"];
    const { role } = req.body;
    const { id } = req.params;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { role },
      { returnDocument: 'after' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "Role updated.",
      user: updatedUser.toPublicJSON()
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      message: "Failed to update role."
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User removed successfully." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Failed to delete user." });
  }
};

module.exports = { getAllUsers, createStaffUser, updateMyProfile, updateUserRole, deleteUser };