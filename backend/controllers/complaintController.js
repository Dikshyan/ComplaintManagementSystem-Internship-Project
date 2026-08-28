const { complaintModel } = require("../models/complaint.model");

const createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority, location, attachments } = req.body;

    if (!title || !category || !description || !priority || !location) {
      return res.status(400).send({ message: "All required fields must be provided" });
    }

    const userId = req.user._id;

    const complaint = await complaintModel.create({
      userId,
      title,
      category,
      description,
      priority,
      location,
      attachments: attachments || [],
      status: "Pending",
      voteCount: 0
    });

    return res.status(201).send({ message: "Complaint Created Successfully", complaint });
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).send({ message: error.message || "Internal server error" });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const complaints = await complaintModel
      .find()
      .populate("userId", "name email username")
      .sort({ createdAt: -1 });

    return res.status(200).send({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).send({ message: "Status field is required" });
    }

    const complaint = await complaintModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).send({ message: "Complaint not found" });
    }

    return res.status(200).send({ message: "Status updated successfully", complaint });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getComplaintStats = async (req, res) => {
  try {
    const complaints = await complaintModel.find();
    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === "Resolved" || c.status === "RESOLVED").length;
    const progress = complaints.filter(c => c.status === "In Progress" || c.status === "IN_PROGRESS").length;
    const active = total - resolved;
    const totalVotes = complaints.reduce((sum, c) => sum + (c.voteCount || 0), 0);

    return res.status(200).send({
      stats: { total, resolved, progress, active, totalVotes }
    });
  } catch (error) {
    console.error("Error calculating stats:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats
};