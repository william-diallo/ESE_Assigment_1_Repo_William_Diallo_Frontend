import apiClient from "./apiClient";

export function updateUserProfile(profileData = {}) {
  const normalizedData = {};

  if (profileData.first_name !== undefined) {
    normalizedData.first_name =
      typeof profileData.first_name === "string"
        ? profileData.first_name.trim()
        : profileData.first_name;
  }

  if (profileData.last_name !== undefined) {
    normalizedData.last_name =
      typeof profileData.last_name === "string"
        ? profileData.last_name.trim()
        : profileData.last_name;
  }

  return apiClient.patch("/auth/profile/", normalizedData);
}
