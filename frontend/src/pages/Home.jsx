import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MainLayout from "../components/layout/MainLayout";
import { getConversationsAPI, markMessagesAsReadAPI } from "../services/chatService";
import { useMessageStore } from "../features/message/messageStore";
import { useSocket } from "../hooks/useSocket";
import { joinRoom } from "../services/socketService";

const Home = () => {
  const queryClient = useQueryClient();
  const [activeChat, setActiveChat] = useState(null);

  useSocket();

  const { activeMessages, fetchMessageHistory, sendMessage } = useMessageStore();

  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsAPI,
    refetchInterval: 5000,
  });

  const conversations = conversationsData?.conversations || [];

  useEffect(() => {
    if (activeChat?.id) {
      fetchMessageHistory(activeChat.id);
      joinRoom(activeChat.id);
      markMessagesAsReadAPI(activeChat.id).catch(() => {});
    }
  }, [activeChat?.id, fetchMessageHistory]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
  };

  const handleSendMessage = async (text) => {
    if (!activeChat?.id) return;
    
    const res = await sendMessage(activeChat.id, text);
    if (res.success) {
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
