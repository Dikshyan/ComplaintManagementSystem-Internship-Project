import { apiRequest } from "./api";
import { toast } from "react-toastify";

export function persistUser(user, fallbackName) {
    const fullName = user.name || fallbackName || "User";
    const username = user.username || fullName.replace(/\s+/g, "") || "user";
    const joinedDate = user.createdAt
        ? new Date(user.createdAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

    const role = user.role || (username.toLowerCase().includes("admin") || (user.email && user.email.toLowerCase().includes("admin")) ? "admin" : "user");

    const currentUser = {
        id: user._id || user.id,
        _id: user._id || user.id,
        username,
        fullName,
        name: fullName,
        email: user.email || "",
        role,
        department: user.department || "",
        avatar: (
            fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "U"
        ).toUpperCase(),
        bio: user.bio || "",
        joinedDate,
        upvotedIssues: user.upvotedIssues || []
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return currentUser;
}

export function readLocal(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}

export async function login(usernameOrEmail, password) {
    try {
        const data = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: usernameOrEmail, username: usernameOrEmail, password })
        });
        localStorage.setItem("authToken", data.token);
        const user = persistUser(data.user, usernameOrEmail);
        toast.success("Signed in successfully");
        return user;
    } catch (err) {
        throw err;
    }
}

export async function register(username, email, password) {
    try {
        const data = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name: username, email, password })
        });
        localStorage.setItem("authToken", data.token);
        const user = persistUser(data.user, username);
        toast.success("Account created successfully");
        return user;
    } catch (err) {
        throw err;
    }
}

export async function fetchCurrentUser() {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    try {
        const data = await apiRequest("/auth/me");
        const user = persistUser(data.user);
        return user;
    } catch (err) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        return null;
    }
}

export function getCurrentUser() {
    return readLocal("currentUser", null);
}

export function logout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
}

export async function forgotPasswordApi(email, newPassword) {
    const data = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, newPassword })
    });
    toast.success("Password reset successfully! You can now sign in.");
    return data;
}