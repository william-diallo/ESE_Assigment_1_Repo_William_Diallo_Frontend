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

// POST /inventory/items/ — corresponds to InventoryItemSerializer
// Accepts: { name, description, amount (maps to quantity), category }
// Automatically sets created_by to the authenticated user
// Returns the created item with id, status, created_at, updated_at
export function createInventoryItem(itemData) {
  return api.post("/inventory/items/", itemData);
}

// GET /inventory/items/ with optional query params:
// name, category, description, search
export function searchInventoryItems(filters = {}) {
  return api.get("/inventory/items/", { params: filters });
}

// GET /inventory/items/:id/
export function getInventoryItem(itemId) {
  return api.get(`/inventory/items/${itemId}/`);
}

// DELETE /inventory/items/:id/
// Backend allows deletion only for admin/staff users.
export function deleteInventoryItem(itemId) {
  return api.delete(`/inventory/items/${itemId}/`);
}

// PATCH /inventory/items/:id/
// Backend allows update only for admin users.
export function updateInventoryItem(itemId, fields) {
  return api.patch(`/inventory/items/${itemId}/`, fields);
}
