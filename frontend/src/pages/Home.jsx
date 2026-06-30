import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { getConversationsAPI } from "../services/chatService";
import { useMessageStore } from "../features/message/messageStore";

const Home = () => {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState(null);

  const { activeMessages, fetchMessageHistory, sendMessage } = useMessageStore();

  // 1. Fetch conversations from database
  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsAPI,
    refetchInterval: 5000, // Poll every 5s to check for updates
  });

  const conversations = conversationsData?.conversations || [];

  // 2. Manage message history sync & polling
  useEffect(() => {
    if (activeChat?.id) {
      // Initial fetch
      fetchMessageHistory(activeChat.id);

      // Polling for updates
      const interval = setInterval(() => {
        fetchMessageHistory(activeChat.id);
      }, 3000);

      return () => clearInterval(interval);
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
