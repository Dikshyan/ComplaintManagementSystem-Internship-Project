import { apiRequest } from "./api";
import { toast } from "react-toastify";

const INITIAL_PROBLEMS_KEY = "complaints";

export function normalizeStatus(status) {
    if (!status) return "Pending";
    const s = status.trim();
    if (s === "IN_PROGRESS" || s === "in progress" || s === "In Progress") return "In Progress";
    if (s === "RESOLVED" || s === "resolved" || s === "Resolved") return "Resolved";
    if (s === "ASSIGNED" || s === "assigned" || s === "Assigned") return "Assigned";
    if (s === "UNDER REVIEW" || s === "under review" || s === "Under Review") return "Under Review";
    if (s === "REJECTED" || s === "rejected" || s === "Rejected") return "Rejected";
    if (s === "OPEN" || s === "open" || s === "Pending" || s === "pending") return "Pending";
    return s;
}

export function mapComplaint(c) {
    return {
        id: c._id,
        _id: c._id,
        title: c.title,
        description: c.description,
        category: c.category,
        location: c.location,
        priority: c.priority,
        status: normalizeStatus(c.status),
        upvotes: c.voteCount || 0,
        votedBy: c.votedBy || [],
        attachments: c.attachments || [],
        assignedTo: c.assignedTo ? (
            typeof c.assignedTo === 'object' ? {
                id: String(c.assignedTo._id || c.assignedTo.id),
                _id: String(c.assignedTo._id || c.assignedTo.id),
                name: c.assignedTo.name || c.assignedTo.username || 'Staff Officer',
                email: c.assignedTo.email || '',
                department: c.assignedTo.department || ''
            } : {
                id: String(c.assignedTo),
                _id: String(c.assignedTo),
                name: '',
                email: '',
                department: ''
            }
        ) : null,
        assignedDepartment: c.assignedDepartment || (typeof c.assignedTo === 'object' ? c.assignedTo?.department : '') || '',
        reporterName: c.userId?.name || c.userId?.username || "Citizen",
        userId: c.userId?._id || c.userId?.id || c.userId,
        dateReported: c.createdAt
            ? new Date(c.createdAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        comments: (c.comments || []).map((comm) => ({
            id: comm._id || comm.id,
            user: comm.userId?.name || comm.userId?.username || "Citizen",
            text: comm.text,
            date: comm.date ? new Date(comm.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
        })),
        resolutionHistory: c.resolutionHistory || [
            {
                status: normalizeStatus(c.status),
                description: `Report registered under ${c.category}.`,
                date: new Date().toISOString().split("T")[0]
            }
        ]
    };
}

export function getIssues() {
    const raw = localStorage.getItem(INITIAL_PROBLEMS_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function getIssueById(id) {
    const issues = getIssues();
    return issues.find((i) => i.id === id || i._id === id);
}

export async function createComplaint({ title, category, description, priority, location, attachments = [] }) {
    const hasFileObject = Array.isArray(attachments) && attachments.some(a => a instanceof File || a instanceof Blob);

    let data;
    if (hasFileObject) {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("description", description);
        formData.append("priority", priority);
        formData.append("location", location);
        attachments.forEach((file) => {
            if (file instanceof File || file instanceof Blob) {
                formData.append("attachments", file);
            }
        });

        data = await apiRequest("/complaint", {
            method: "POST",
            body: formData
        });
    } else {
        data = await apiRequest("/complaint", {
            method: "POST",
            body: JSON.stringify({ title, description, category, location, priority, attachments })
        });
    }
    return data;
}

export async function submitIssue(title, description, category, location, priority, attachments = []) {
    const token = localStorage.getItem("authToken");

    if (!token) {
        const issues = getIssues();
        const newIssue = {
            id: `ISS-${Date.now().toString().slice(-4)}`,
            title,
            description,
            category,
            location,
            priority,
            status: "Pending",
            upvotes: 1,
            reporterName: "Guest Citizen",
            dateReported: new Date().toISOString().split("T")[0],
            comments: [],
            resolutionHistory: [
                { status: "Pending", description: `Registered under ${category}.`, date: new Date().toISOString().split("T")[0] }
            ]
        };
        issues.unshift(newIssue);
        localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
        toast.success("Complaint submitted");
        return newIssue;
    }

    const data = await createComplaint({ title, category, description, priority, location, attachments });
    toast.success("Complaint submitted successfully");
    await fetchComplaintsApi();
    return data.complaint;
}

export async function getComplaints() {
    try {
        const data = await apiRequest("/complaint");
        const complaints = (data.complaints || []).map(mapComplaint);
        localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(complaints));
        return complaints;
    } catch (err) {
        return getIssues();
    }
}

export async function fetchComplaintsApi() {
    return getComplaints();
}

export async function getMyComplaints() {
    const token = localStorage.getItem("authToken");
    if (!token) {
        const all = getIssues();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return [];
        return all.filter(i => i.userId === currentUser.id || i.reporterName === currentUser.fullName || i.reporterName === currentUser.name);
    }

    try {
        const data = await apiRequest("/complaint/my");
        return (data.complaints || []).map(mapComplaint);
    } catch (err) {
        const all = await fetchComplaintsApi();
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) return [];
        return all.filter(i => i.userId === currentUser.id || i.reporterName === currentUser.fullName || i.reporterName === currentUser.name);
    }
}

export async function fetchMyComplaintsApi() {
    return getMyComplaints();
}

export async function voteComplaint(id, direction) {
    return apiRequest(`/complaint/${id}/vote`, {
        method: "PATCH",
        body: JSON.stringify({ direction })
    });
}

export async function upvoteIssue(id) {
    const issues = getIssues();
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { upvotedIssues: [] };
    const idx = issues.findIndex(i => i.id === id || i._id === id);
    if (idx === -1) return null;
    const isUpvoted = (currentUser.upvotedIssues || []).includes(id);
    const direction = isUpvoted ? "down" : "up";

    if (id && id.length === 24) {
        try {
            const data = await voteComplaint(id, direction);
            issues[idx].upvotes = data.voteCount;
        } catch (err) {
            issues[idx].upvotes = isUpvoted
                ? Math.max(0, (issues[idx].upvotes || 1) - 1)
                : (issues[idx].upvotes || 0) + 1;
        }
    } else {
        issues[idx].upvotes = isUpvoted
            ? Math.max(0, (issues[idx].upvotes || 1) - 1)
            : (issues[idx].upvotes || 0) + 1;
    }

    if (isUpvoted) {
        currentUser.upvotedIssues = (currentUser.upvotedIssues || []).filter(x => x !== id);
        toast.info("Removed your vote");
    } else {
        currentUser.upvotedIssues = [...(currentUser.upvotedIssues || []), id];
        toast.success("Thanks — your vote was recorded");
    }
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return { issue: issues[idx], isUpvoted: !isUpvoted };
}

export function hasUpvoted(id) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { upvotedIssues: [] };
    return (currentUser.upvotedIssues || []).includes(id);
}

export async function addComment(issueId, text) {
    if (!text || !text.trim()) return null;
    const token = localStorage.getItem("authToken");

    if (token && issueId && issueId.length === 24) {
        try {
            const data = await apiRequest(`/complaint/${issueId}/comments`, {
                method: "POST",
                body: JSON.stringify({ text })
            });
            const issues = getIssues();
            const idx = issues.findIndex(i => i.id === issueId || i._id === issueId);
            if (idx !== -1) {
                issues[idx].comments = [...(issues[idx].comments || []), data.comment];
                localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
            }
            toast.success("Comment added");
            return data.comment;
        } catch (err) {
            return null;
        }
    }

    const issues = getIssues();
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { fullName: "Guest" };
    const idx = issues.findIndex(i => i.id === issueId || i._id === issueId);
    if (idx === -1) return null;
    const newComment = { id: `c_${Date.now()}`, user: currentUser.fullName || currentUser.name, text, date: new Date().toISOString().split("T")[0] };
    issues[idx].comments = [...(issues[idx].comments || []), newComment];
    localStorage.setItem(INITIAL_PROBLEMS_KEY, JSON.stringify(issues));
    toast.success("Comment added");
    return newComment;
}

export async function getComplaintStats() {
    return apiRequest("/complaint/stats");
}

export async function getStats(providedIssues = null) {
    if (providedIssues && Array.isArray(providedIssues)) {
        const total = providedIssues.length;
        const resolved = providedIssues.filter(i => (i.status || "").toLowerCase() === "resolved").length;
        const progress = providedIssues.filter(i => {
            const s = (i.status || "").toLowerCase();
            return s === "in progress" || s === "under review" || s === "pending" || s === "assigned";
        }).length;
        const active = total - resolved;
        const totalVotes = providedIssues.reduce((acc, i) => acc + (i.upvotes || i.voteCount || 0), 0);
        return { total, resolved, progress, active, totalVotes };
    }

    try {
        const data = await getComplaintStats();
        if (data && data.stats) {
            return data.stats;
        }
    } catch (err) {
        // ignore
    }

    try {
        const liveIssues = await fetchComplaintsApi();
        const total = liveIssues.length;
        const resolved = liveIssues.filter(i => (i.status || "").toLowerCase() === "resolved").length;
        const progress = liveIssues.filter(i => {
            const s = (i.status || "").toLowerCase();
            return s === "in progress" || s === "under review" || s === "pending" || s === "assigned";
        }).length;
        const active = total - resolved;
        const totalVotes = liveIssues.reduce((acc, i) => acc + (i.upvotes || i.voteCount || 0), 0);
        return { total, resolved, progress, active, totalVotes };
    } catch (e) {
        return { total: 0, resolved: 0, progress: 0, active: 0, totalVotes: 0 };
    }
}