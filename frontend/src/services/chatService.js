import apiClient from "./apiClient";

export const getConversationsAPI = async () => {
  const response = await apiClient.get("/api/chats/conversations");
  return response.data;
};
