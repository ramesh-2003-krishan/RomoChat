import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { getConversationsAPI, getMessagesAPI, sendMessageAPI } from "../services/chatService";

const Home = () => {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState(null);

  // 1. Fetch conversations from database
  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsAPI,
    refetchInterval: 5000, // Poll every 5s to check for updates
  });

  const conversations = conversationsData?.conversations || [];

  // 2. Fetch message history for selected chat
  const { data: messagesData } = useQuery({
    queryKey: ["messages", activeChat?.id],
    queryFn: () => getMessagesAPI(activeChat.id),
    enabled: !!activeChat?.id,
    refetchInterval: 3000, // Poll every 3s to get messages instantly
  });

  const messages = messagesData?.messages || [];

  // 3. Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessageAPI,
    onSuccess: () => {
      // Invalidate target caches to trigger refresh
      queryClient.invalidateQueries({ queryKey: ["messages", activeChat?.id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleSendMessage = (text) => {
    if (!activeChat?.id) return;
    
    sendMessageMutation.mutate({
      conversationId: activeChat.id,
      content: text,
    });
  };

  return (
    <MainLayout
      conversations={conversations}
      activeChat={activeChat}
      onSelectChat={handleSelectChat}
      mockMessages={messages}
      onSendMessage={handleSendMessage}
    />
  );
};

export default Home;
