import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { getConversationsAPI } from "../services/chatService";
import { useMessageStore } from "../features/message/messageStore";
import { useSocket } from "../hooks/useSocket";
import { joinRoom } from "../services/socketService";

const Home = () => {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState(null);

  // Initialize socket connection and message listeners
  useSocket();

  const { activeMessages, fetchMessageHistory, sendMessage } = useMessageStore();

  // 1. Fetch conversations from database
  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsAPI,
    refetchInterval: 5000, // Poll every 5s to check for new conversation items
  });

  const conversations = conversationsData?.conversations || [];

  // 2. Manage message history sync & join socket room lobby
  useEffect(() => {
    if (activeChat?.id) {
      // Initial REST fetch for history logs
      fetchMessageHistory(activeChat.id);

      // Join the socket room for real-time delivery
      joinRoom(activeChat.id);
    }
  }, [activeChat?.id, fetchMessageHistory]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleSendMessage = async (text) => {
    if (!activeChat?.id) return;
    
    const res = await sendMessage(activeChat.id, text);
    if (res.success) {
      // Invalidate conversations query to refresh last message preview in sidebar
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  };

  return (
    <MainLayout
      conversations={conversations}
      activeChat={activeChat}
      onSelectChat={handleSelectChat}
      mockMessages={activeMessages}
      onSendMessage={handleSendMessage}
    />
  );
};

export default Home;
