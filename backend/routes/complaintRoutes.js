const express = require("express");
const { createComplaint } = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/", protect, createComplaint);

module.exports = router;