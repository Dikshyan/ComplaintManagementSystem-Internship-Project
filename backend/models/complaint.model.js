const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Infrastructure",
        "Sanitation",
        "Water Supply",
        "Electricity",
        "Public Safety",
        "Roads & Traffic",
        "Environment",
        "Public Services",
        "Transportation",
        "Safety",
        "Other",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    attachments: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Under Review",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    assignedDepartment: {
      type: String,
      default: "",
    },

    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    voteCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    votedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const complaintModel = mongoose.model("Complaint", complaintSchema);

module.exports = { complaintModel };
