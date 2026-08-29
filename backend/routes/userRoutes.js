const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const {
  updateMyProfile,
  updateUserRole,
  getAllUsers,
  createStaffUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/staff", protect, requireAdmin, createStaffUser);
router.patch("/me", protect, updateMyProfile);
router.patch("/:id/role", protect, requireAdmin, updateUserRole);
router.delete("/:id", protect, requireAdmin, deleteUser);

module.exports = router;