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

export const getMessagesAPI = async (conversationId) => {
  const response = await apiClient.get(`/api/chats/messages/${conversationId}`);
  return response.data;
};

export const sendMessageAPI = async ({ conversationId, content }) => {
  const response = await apiClient.post("/api/chats/messages", {
    conversationId,
    content,
  });
  return response.data;
};
