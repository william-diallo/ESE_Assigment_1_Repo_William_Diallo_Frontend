import apiClient from "./apiClient";

export function loginUser(credentials) {
  return apiClient.post("/auth/login/", credentials);
}

export function registerUser(data) {
  return apiClient.post("/auth/register/", data);
}

export function getCurrentUser() {
  return apiClient.get("/auth/me/");
}
