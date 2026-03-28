import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Load token on startup
const token = localStorage.getItem("token");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;

export function loginUser(credentials) {
  return api.post("/auth/login/", credentials);
}

// POST /auth/register/ — matches RegisterSerializer fields: email, password, role
// The backend defaults role to "STAFF" when omitted, so role is optional here
export function registerUser(data) {
  return api.post("/auth/register/", data);
}
