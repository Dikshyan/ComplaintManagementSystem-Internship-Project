const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  updateComplaintStatus,
  assignComplaint,
  getComplaintStats,
  voteOnComplaint,
  addCommentToComplaint
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllComplaints);
router.get("/my", protect, getMyComplaints);
router.get("/stats", getComplaintStats);
router.post("/", protect, createComplaint);
router.patch("/:id/status", updateComplaintStatus);
router.patch("/:id/assign", assignComplaint);
router.patch("/:id/vote", protect, voteOnComplaint);
router.post("/:id/comments", protect, addCommentToComplaint);

module.exports = router;