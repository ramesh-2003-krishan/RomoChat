import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";

const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    otherParticipantName: "Subham Rana",
    lastMessage: "Hey, are we still meeting today?",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    isOnline: true,
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "conv-2",
    otherParticipantName: "Alice Smith",
    lastMessage: "The new design looks clean!",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isOnline: false,
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "conv-3",
    groupName: "Project Alpha Group",
    otherParticipantName: "Project Alpha Group",
    lastMessage: "Bob: I've updated the gateway API routes.",
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isOnline: true,
    unreadCount: 0,
    isGroup: true,
  },
];

const INITIAL_MESSAGES = {
  "conv-1": [
    { id: "msg-1-1", senderId: "other", content: "Hey! How is the RomoChat frontend coming along?", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: "msg-1-2", senderId: "me", content: "Going great! Just setting up the styling and layouts.", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: "msg-1-3", senderId: "other", content: "Awesome, let me know if you need help with Socket integrations.", createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString() },
    { id: "msg-1-4", senderId: "other", content: "Hey, are we still meeting today?", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  ],
  "conv-2": [
    { id: "msg-2-1", senderId: "other", content: "Did you review the Tailwind configuration?", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
    { id: "msg-2-2", senderId: "me", content: "Yes, I moved to Tailwind CSS v4 to leverage Vite plugin integration directly.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
    { id: "msg-2-3", senderId: "other", content: "The new design looks clean!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
  ],
  "conv-3": [
    { id: "msg-3-1", senderId: "other", content: "Alice: Remember to check env variables.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
    { id: "msg-3-2", senderId: "other", content: "Bob: I've updated the gateway API routes.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
  ],
};

const Home = () => {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    
    // Clear unreadCount on select
    setConversations((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (text) => {
    if (!activeChat) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      content: text,
      createdAt: new Date().toISOString(),
    };

    // Update messages log
    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg],
    }));

    // Update conversation lastMessage
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              lastMessage: text,
              lastMessageAt: newMsg.createdAt,
            }
          : c
      )
    );
  };

  return (
    <MainLayout
      conversations={conversations}
      activeChat={activeChat}
      onSelectChat={handleSelectChat}
      mockMessages={activeChat ? messages[activeChat.id] || [] : []}
      onSendMessage={handleSendMessage}
    />
  );
};

export default Home;
