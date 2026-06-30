import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../config/socket";
import { connectSocket, disconnectSocket } from "../services/socketService";
import { useAuthStore } from "../features/auth/authStore";
import { useMessageStore } from "../features/message/messageStore";

export const useSocket = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const addMessageToHistory = useMessageStore((state) => state.addMessageToHistory);
  const setTypingStatus = useMessageStore((state) => state.setTypingStatus);
  const markLocalMessagesAsRead = useMessageStore((state) => state.markLocalMessagesAsRead);

  useEffect(() => {
    if (token) {
      connectSocket(token);

      const handleNewMessage = (message) => {
        console.log("WebSocket message received:", message);
        if (message) {
          addMessageToHistory(message.conversationId, message);
        }
      };

      const handleTyping = ({ conversationId, userId, isTyping }) => {
        console.log("WebSocket typing status received:", { conversationId, userId, isTyping });
        setTypingStatus(conversationId, userId, isTyping);
      };

      const handleUserStatus = ({ userId, isOnline }) => {
        console.log("WebSocket user status received:", { userId, isOnline });
        queryClient.setQueryData(["profile", userId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            profile: {
              ...oldData.profile,
              isOnline,
            },
          };
        });
      };

      const handleMessagesRead = ({ conversationId, readerId }) => {
        console.log("WebSocket messages read:", { conversationId, readerId });
        markLocalMessagesAsRead(conversationId, readerId);
      };

      socket.on("new_message", handleNewMessage);
      socket.on("typing", handleTyping);
      socket.on("user_status", handleUserStatus);
      socket.on("messages_read", handleMessagesRead);

      const handleConnect = () => console.log("Socket connected successfully: ID =", socket.id);
      const handleDisconnect = (reason) => console.log("Socket disconnected:", reason);
      const handleConnectError = (err) => console.error("Socket connection error:", err.message);

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("connect_error", handleConnectError);

      return () => {
        socket.off("new_message", handleNewMessage);
        socket.off("typing", handleTyping);
        socket.off("user_status", handleUserStatus);
        socket.off("messages_read", handleMessagesRead);
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        disconnectSocket();
      };
    }
  }, [token, addMessageToHistory, setTypingStatus, markLocalMessagesAsRead, queryClient]);

  return socket;
};
export default useSocket;
