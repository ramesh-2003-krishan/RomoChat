import apiClient from "./apiClient";

export const loginAPI = async (email, password) => {
  const response = await apiClient.post("/api/auth/login", { email, password });
  return response.data;
};

export const registerAPI = async (username, email, password) => {
  const response = await apiClient.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};
