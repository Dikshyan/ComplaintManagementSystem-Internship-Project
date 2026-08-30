import { apiRequest } from "./api";

export async function getUsers() {
    return apiRequest("/users");
}

export async function fetchUsersApi() {
    try {
        const data = await getUsers();
        return (data.users || []).map((u) => ({
            id: u._id || u.id,
            _id: u._id || u.id,
            name: u.name || u.username || "Citizen User",
            email: u.email || "N/A",
            role: u.role || "user",
            department: u.department || "",
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : "2026-08-01"
        }));
    } catch (err) {
        console.error("Fetch users API error:", err);
        return [];
    }
}

export async function getUserById(id) {
    return apiRequest(`/users/${id}`);
}