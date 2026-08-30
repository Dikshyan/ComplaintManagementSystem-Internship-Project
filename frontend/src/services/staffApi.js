import { apiRequest } from "./api";
import { toast } from "react-toastify";
import { normalizeStatus, getIssues } from "./complaintApi";

export async function getAssignedComplaints() {
    return apiRequest("/complaint/my");
}

export async function updateComplaintStatus(id, status) {
    const normalizedStatus = normalizeStatus(status);
    if (id && id.length === 24) {
        await apiRequest(`/complaint/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: normalizedStatus })
        });
    }

    const issues = getIssues();
    const idx = issues.findIndex(i => i.id === id || i._id === id);
    if (idx !== -1) {
        issues[idx].status = normalizedStatus;
        if (!issues[idx].resolutionHistory) {
            issues[idx].resolutionHistory = [];
        }
        issues[idx].resolutionHistory.push({
            status: normalizedStatus,
            description: `Status updated to ${normalizedStatus}.`,
            date: new Date().toISOString().split("T")[0]
        });
        localStorage.setItem("complaints", JSON.stringify(issues));
    }

    toast.success(`Status updated to ${normalizedStatus}`);
    return getIssues();
}

export async function updateIssueStatus(id, status) {
    return updateComplaintStatus(id, status);
}