import apiClient from "./apiClient";

export const getConversationsAPI = async () => {
  const response = await apiClient.get("/api/chats/conversations");
  return response.data;
};

export const createConversationAPI = async (receiverId) => {
  const response = await apiClient.post("/api/chats/conversations", {
    receiverId,
  });
  return response.data;
};
