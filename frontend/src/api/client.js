const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed. Please try again.");
  return data;
}

export const api = {
  status: () => request("/auth/status"),
  connectGoogle: () => { window.location.href = `${API_URL}/auth/google`; },
  logout: () => request("/auth/logout", { method: "POST" }),
  listEvents: () => request("/events"),
  createEvent: (event) => request("/events", { method: "POST", body: JSON.stringify(event) }),
  deleteEvent: (id) => request(`/events/${encodeURIComponent(id)}`, { method: "DELETE" })
};