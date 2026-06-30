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

  useEffect(() => {
    if (token) {
      // Connect socket
      connectSocket(token);

      // Listener for incoming new messages
      const handleNewMessage = (message) => {
        console.log("WebSocket message received:", message);
        if (message) {
          addMessageToHistory(message.conversationId, message);
        }
      };

      // Listener for typing status updates
      const handleTyping = ({ conversationId, userId, isTyping }) => {
        console.log("WebSocket typing status received:", { conversationId, userId, isTyping });
        setTypingStatus(conversationId, userId, isTyping);
      };

      // Listener for presence updates (online/offline status)
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

      socket.on("new_message", handleNewMessage);
      socket.on("typing", handleTyping);
      socket.on("user_status", handleUserStatus);

      // Handle socket connection states logging for debugging
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
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("connect_error", handleConnectError);
        disconnectSocket();
      };
    }
  }, [token, addMessageToHistory, setTypingStatus, queryClient]);

  return socket;
};
export default useSocket;
