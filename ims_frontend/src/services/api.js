import axios from "axios";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: apiBaseUrl,
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

// POST /auth/password-reset-request/ — corresponds to PasswordResetRequestSerializer
// Accepts: { email }
// Backend sends a 6-digit reset code to the email address
export function requestPasswordReset(email) {
  return api.post("/auth/password-reset/request/", { email });
}

// POST /auth/password-reset-confirm/ — corresponds to PasswordResetConfirmSerializer
// Accepts: { email, code, new_password }
// Backend validates code (not expired, not used) and updates the user's password
export function confirmPasswordReset(email, code, newPassword) {
  return api.post("/auth/password-reset/confirm/", {
    email,
    code,
    new_password: newPassword,
  });
}
