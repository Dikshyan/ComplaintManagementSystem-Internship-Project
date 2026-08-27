const { complaintModel } = require("../models/complaint.model");

const createComplaint = async(req, res) => {
    try {
        const {title, category, description, priority, location, attachments} = req.body;

        if(!title || !category || !description || !priority || !location){
            return res.status(400).send({ message: " All required fields must be provided"});
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

        return res.status(201).send({ message : "Complaint Created Successfully", complaint });

    } catch (error) {
        console.error("Internal server error:", error);

        return res.status(500).send({ message : "Internal server error" })
    }
}

module.exports = {
    createComplaint
}