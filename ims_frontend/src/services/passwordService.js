import apiClient from "./apiClient";

export function requestPasswordReset(email) {
  return apiClient.post("/auth/password-reset/request/", { email });
}

export function confirmPasswordReset(email, code, newPassword) {
  return apiClient.post("/auth/password-reset/confirm/", {
    email,
    code,
    new_password: newPassword,
  });
}
