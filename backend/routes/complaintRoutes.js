const express = require("express");
const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllComplaints);
router.get("/stats", getComplaintStats);
router.post("/", protect, createComplaint);
router.patch("/:id/status", updateComplaintStatus);

module.exports = router;