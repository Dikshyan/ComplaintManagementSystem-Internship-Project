const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: String,
            enum: [
                "Infrastructure",
                "Sanitation",
                "Environment",
                "Public Services",
                "Transportation",
                "Safety",
                "Other"
            ],
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        attachments: [
            {
                type: String
            }
        ],

        status: {
            type: String,
            enum: [
                "Pending",
                "Under Review",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Pending"
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        voteCount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const complaintModel = mongoose.model("Complaint", complaintSchema);

module.exports = { complaintModel };