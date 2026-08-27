const { userModel } = require("../models/user.model");
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
      { new: true, runValidators: true }
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
      { new: true }
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

module.exports = { updateMyProfile, updateUserRole };