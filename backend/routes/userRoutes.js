const express = require("express");

const { protect } = require("../middleware/authMiddleware");

const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  updateMyProfile,
  updateUserRole,
  getAllUsers,
  createStaffUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// Admin only
router.get("/", protect, requireAdmin, getAllUsers);

router.post("/staff", protect, requireAdmin, createStaffUser);

router.patch("/:id/role", protect, requireAdmin, updateUserRole);

router.delete("/:id", protect, requireAdmin, deleteUser);

// Authenticated users
router.patch("/me", protect, updateMyProfile);

module.exports = router;
