import apiClient from "./apiClient";

export const getProfileAPI = async () => {
  const response = await apiClient.get("/api/users/profile");
  return response.data;
};

export const updateProfileAPI = async (profileData) => {
  const response = await apiClient.patch("/api/users/profile", profileData);
  return response.data;
};
