import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../config/socket";
import { connectSocket, disconnectSocket, joinRoom } from "../services/socketService";
import { useAuthStore } from "../features/auth/authStore";
import { useMessageStore } from "../features/message/messageStore";
import { useNotificationStore } from "../features/notification/notificationStore";
import { playNotificationChime } from "../utils/audioHelper";
import { showSystemNotification } from "../utils/notificationHelper";
import { getProfileByIdAPI } from "../services/userService";

export const useSocket = (activeChatId) => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const addMessageToHistory = useMessageStore((state) => state.addMessageToHistory);
  const setTypingStatus = useMessageStore((state) => state.setTypingStatus);
  const markLocalMessagesAsRead = useMessageStore((state) => state.markLocalMessagesAsRead);
  const addToast = useNotificationStore((state) => state.addToast);

  const activeChatIdRef = useRef(activeChatId);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (token) {
      connectSocket(token);

      const handleNewMessage = async (message) => {
        if (message) {
          addMessageToHistory(message.conversationId, message);

          const currentActiveId = activeChatIdRef.current;
          if (message.conversationId !== currentActiveId) {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            playNotificationChime();

            let senderName = "New Message";
            try {
              const cacheData = queryClient.getQueryData(["profile", message.senderId]);
              if (cacheData?.profile) {
                senderName = cacheData.profile.displayName || cacheData.profile.username;
              } else {
                const res = await queryClient.fetchQuery({
                  queryKey: ["profile", message.senderId],
                  queryFn: () => getProfileByIdAPI(message.senderId),
                });
                senderName = res?.profile?.displayName || res?.profile?.username || "New Message";
              }
            } catch (err) { }

            addToast({
              title: senderName,
              body: message.content,
              conversationId: message.conversationId,
            });

            if (document.hidden) {
              showSystemNotification(senderName, message.content);
            }
          }
        }
      };

      const handleTyping = ({ conversationId, userId, isTyping }) => {
        setTypingStatus(conversationId, userId, isTyping);
      };

      const handleUserStatus = ({ userId, isOnline }) => {
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
        markLocalMessagesAsRead(conversationId, readerId);
      };

      const handleConnect = () => {
        if (activeChatIdRef.current) {
          joinRoom(activeChatIdRef.current);
        }
      };

      socket.on("new_message", handleNewMessage);
      socket.on("typing", handleTyping);
      socket.on("user_status", handleUserStatus);
      socket.on("messages_read", handleMessagesRead);
      socket.on("connect", handleConnect);

      if (socket.connected && activeChatIdRef.current) {
        joinRoom(activeChatIdRef.current);
      }

      return () => {
        socket.off("new_message", handleNewMessage);
        socket.off("typing", handleTyping);
        socket.off("user_status", handleUserStatus);
        socket.off("messages_read", handleMessagesRead);
        socket.off("connect", handleConnect);
        disconnectSocket();
      };
    }
  }, [token, addMessageToHistory, setTypingStatus, markLocalMessagesAsRead, queryClient, addToast]);

  return socket;
};
export default useSocket;
