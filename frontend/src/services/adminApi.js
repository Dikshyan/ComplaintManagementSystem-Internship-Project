import { apiRequest } from "./api";
import { toast } from "react-toastify";
import { getIssues } from "./complaintApi";

export async function getAdminComplaints() {
    return apiRequest("/complaint");
}

export async function getAdminStats() {
    return apiRequest("/complaint/stats");
}

export async function assignComplaint(id, assignedTo, department) {
    const body = {};
    if (assignedTo) body.assignedTo = assignedTo;
    if (department) body.assignedDepartment = department;

    let data;
    if (id && id.length === 24) {
        data = await apiRequest(`/complaint/${id}/assign`, {
            method: "PATCH",
            body: JSON.stringify(body)
        });
    }

    const issues = getIssues();
    const idx = issues.findIndex(i => i.id === id || i._id === id);
    if (idx !== -1) {
        issues[idx].status = "Assigned";
        if (assignedTo) issues[idx].assignedTo = assignedTo;
        if (department) issues[idx].assignedDepartment = department;
        localStorage.setItem("complaints", JSON.stringify(issues));
    }

    toast.success("Grievance assigned to staff member successfully");
    return data || getIssues();
}

export async function assignComplaintApi(id, staffId, department) {
    return assignComplaint(id, staffId, department);
}

export async function createStaffAccountApi({ name, email, password, department }) {
    const data = await apiRequest("/users/staff", {
        method: "POST",
        body: JSON.stringify({ name, email, password, department })
    });
    toast.success(`Staff account for ${name} created successfully!`);
    return data.user || data;
}

export async function deleteUserApi(userId) {
    const data = await apiRequest(`/users/${userId}`, {
        method: "DELETE"
    });
    toast.success("User account removed successfully");
    return data;
}

export async function deleteRejectedComplaintApi(id) {
    let data;
    if (id && id.length === 24) {
        data = await apiRequest(`/complaint/${id}`, {
            method: "DELETE"
        });
    }

    const issues = getIssues();
    const updated = issues.filter(i => i.id !== id && i._id !== id);
    localStorage.setItem("complaints", JSON.stringify(updated));

    toast.success("Rejected complaint removed successfully");
    return data || updated;
}