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
    const resolved = complaints.filter(c => (c.status || '').toLowerCase() === "resolved").length;
    const progress = complaints.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s === "in progress" || s === "under review" || s === "pending";
    }).length;
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

const voteOnComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body; // "up" or "down"

    const increment = direction === "down" ? -1 : 1;
    const complaint = await complaintModel.findById(id);

    if (!complaint) {
      return res.status(404).send({ message: "Complaint not found" });
    }

    complaint.voteCount = Math.max(0, (complaint.voteCount || 0) + increment);
    await complaint.save();

    return res.status(200).send({
      message: increment > 0 ? "Vote added" : "Vote removed",
      voteCount: complaint.voteCount
    });
  } catch (error) {
    console.error("Error voting on complaint:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

const addCommentToComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).send({ message: "Comment text is required" });
    }

    const complaint = await complaintModel.findById(id);

    if (!complaint) {
      return res.status(404).send({ message: "Complaint not found" });
    }

    const comment = {
      userId: req.user._id,
      text: text.trim(),
      date: new Date()
    };

    complaint.comments.push(comment);
    await complaint.save();

    // Populate the user info for the newly added comment
    const populated = await complaintModel.findById(id).populate("comments.userId", "name username");
    const addedComment = populated.comments[populated.comments.length - 1];

    return res.status(201).send({
      message: "Comment added",
      comment: {
        id: addedComment._id,
        user: addedComment.userId?.name || addedComment.userId?.username || "Citizen",
        text: addedComment.text,
        date: addedComment.date.toISOString().split("T")[0]
      }
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats,
  voteOnComplaint,
  addCommentToComplaint
};