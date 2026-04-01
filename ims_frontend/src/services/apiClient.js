import axios from "axios";

const apiBaseUrl =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

const TOKEN_KEY = "token";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
  delete apiClient.defaults.headers.common.Authorization;
}

// Load token on startup for persisted sessions.
const initialToken = getStoredToken();
if (initialToken) {
  apiClient.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

export default apiClient;
