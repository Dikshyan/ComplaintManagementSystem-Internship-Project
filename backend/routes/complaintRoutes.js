const express = require("express");

const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
  assignComplaint,
  getComplaintStats,
  voteOnComplaint,
  addCommentToComplaint,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

const {
  requireAdmin,
  requireStaffOrAdmin,
} = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getAllComplaints);
router.get("/stats", getComplaintStats);

// User
router.get("/my", protect, getMyComplaints);

router.post(
  "/",
  protect,
  upload.array("attachments", 5),
  createComplaint
);

router.patch("/:id/vote", protect, voteOnComplaint);

router.post(
  "/:id/comments",
  protect,
  addCommentToComplaint
);

// Staff + Admin
router.patch(
  "/:id/status",
  protect,
  requireStaffOrAdmin,
  updateComplaintStatus
);

// Admin only
router.patch(
  "/:id/assign",
  protect,
  requireAdmin,
  assignComplaint
);

module.exports = router;