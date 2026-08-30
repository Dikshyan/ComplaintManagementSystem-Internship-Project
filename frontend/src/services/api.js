const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api").replace(/\/$/, "");

export async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("authToken");

    const headers = {
        ...(options.body instanceof FormData
            ? {}
            : { "Content-Type": "application/json" }),
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        ...(options.headers || {})
    };

    const response = await fetch(
        `${API_BASE_URL}${path}`,
        {
            ...options,
            headers
        }
    );

    const contentType = response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
        ? await response.json()
        : {};

    if (response.status === 401 && token) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        window.location.href = "/login";
        throw new Error("Session expired. Please sign in again.");
    }

    if (!response.ok) {
        const msg = data.message || "Request failed";
        throw new Error(msg);
    }

    return data;
}