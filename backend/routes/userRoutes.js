const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const {
  updateMyProfile,
  updateUserRole,
  getAllUsers
} = require("../controllers/userController");

const router = express.Router();

router.get("/", protect, requireAdmin, getAllUsers);

router.patch("/me", protect, updateMyProfile);

router.patch("/:id/role", protect, requireAdmin, updateUserRole);

module.exports = router;