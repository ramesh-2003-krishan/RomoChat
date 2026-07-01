import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchBar from "../common/SearchBar";
import Avatar from "../common/Avatar";
import Modal from "../common/Modal";
import { useAuthStore } from "../../features/auth/authStore";
import { getProfileByIdAPI, searchUsersAPI } from "../../services/userService";
import { createConversationAPI } from "../../services/chatService";

const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
};

const ConversationItem = ({ chat, activeChatId, onSelectChat, currentUserId, typingStates }) => {
  const isGroup = chat.isGroup;
  const otherParticipantId = isGroup
    ? null
    : chat.participants?.find((id) => id !== currentUserId);

  // Resolve other participant details using React Query
  const { data } = useQuery({
    queryKey: ["profile", otherParticipantId],
    queryFn: () => getProfileByIdAPI(otherParticipantId),
    enabled: !!otherParticipantId,
  });

  const profile = data?.profile;
  const chatName = isGroup ? chat.groupName : (profile?.displayName || profile?.username || "Loading...");
  const isOnline = isGroup ? false : (profile?.isOnline || false);
  const isActive = chat._id === activeChatId;

  // Determine if other participant is currently typing
  const conversationTyping = typingStates?.[chat._id] || {};
  const otherTypingIds = Object.keys(conversationTyping).filter((id) => id !== currentUserId && conversationTyping[id]);
  const isTyping = otherTypingIds.length > 0;

  const handleClick = () => {
    onSelectChat({
      ...chat,
      id: chat._id,
      otherParticipantName: chatName,
      isOnline,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all duration-200 cursor-pointer ${
        isActive
          ? "bg-[hsla(263,70%,50%,0.15)] border border-[hsla(263,70%,50%,0.25)]"
          : "hover:bg-[hsl(var(--bg-tertiary))] border border-transparent"
      }`}
    >
      <Avatar name={chatName} isOnline={isOnline} size="w-11 h-11" />
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <h4 className="text-xs font-bold text-[hsl(var(--text-main))] truncate">
            {chatName}
          </h4>
          <span className="text-[9px] text-[hsl(var(--text-muted))]">
            {formatTime(chat.lastMessageAt || chat.updatedAt)}
          </span>
        </div>
        <p className={`text-[11px] truncate ${isTyping ? "text-[hsl(var(--primary))] font-bold animate-pulse" : "text-[hsl(var(--text-muted))]"}`}>
          {isTyping ? "Typing..." : (chat.lastMessage || "No messages yet")}
        </p>
      </div>

      {chat.unreadCount > 0 && (
        <span className="flex-shrink-0 h-4 min-w-[16px] rounded-full bg-[hsl(var(--primary))] text-[8px] font-bold text-white flex items-center justify-center px-1">
          {chat.unreadCount}
        </span>
      )}
    </button>
  );
};

const Sidebar = ({ conversations = [], activeChatId, onSelectChat, typingStates }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  // Query to search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", modalSearchQuery],
    queryFn: () => searchUsersAPI(modalSearchQuery),
    enabled: modalSearchQuery.trim().length > 0,
  });

  const searchedUsers = searchResults?.profiles || [];

  // Mutation to start new chat
  const startChatMutation = useMutation({
    mutationFn: createConversationAPI,
    onSuccess: (res) => {
      // Refresh active conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      
      // Auto select the new chat
      onSelectChat({
        ...res.conversation,
        id: res.conversation._id,
        otherParticipantName: "Loading...",
      });

      // Clear and close
      setIsModalOpen(false);
      setModalSearchQuery("");
    },
  });

  const filteredConversations = conversations.filter((c) => {
    if (searchQuery === "") return true;
    const name = c.isGroup ? c.groupName : "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full md:w-80 h-full bg-[hsl(var(--bg-secondary))] flex flex-col border-r border-[hsl(var(--card-border))]">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--card-border))]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center font-bold text-white shadow-md text-sm">
            <img src="/logo.svg" alt="RomoChat Logo" className="w-5 h-5" />
          </div>
          <span className="text-md font-bold tracking-tight text-gradient">
            RomoChat
          </span>
        </div>

        {/* Plus Button to open new chat modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition-colors cursor-pointer"
          title="Start Chat"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Search Panel */}
      <div className="p-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search chats..." />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-[hsl(var(--text-muted))] text-xs">
            No chats found
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <ConversationItem
              key={chat._id}
              chat={chat}
              activeChatId={activeChatId}
              onSelectChat={onSelectChat}
              currentUserId={user?.id}
              typingStates={typingStates}
            />
          ))
        )}
      </div>

      {/* User Session Footer */}
      <div className="p-4 border-t border-[hsl(var(--card-border))] bg-[hsla(240,10%,4%,0.2)] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar name={user?.username || "Me"} size="w-9 h-9" />
          <div className="min-w-0">
            <h5 className="text-xs font-bold text-[hsl(var(--text-main))] truncate">
              {user?.username || "Guest"}
            </h5>
            <p className="text-[10px] text-[hsl(var(--text-muted))] truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            to="/settings"
            className="p-2 rounded-lg text-[hsl(var(--text-muted))] hover:text-[hsl(var(--primary-hover))] hover:bg-[hsla(263,70%,50%,0.1)] transition-all"
            title="Profile Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>

          <button
            onClick={logout}
            className="p-2 rounded-lg text-[hsl(var(--text-muted))] hover:text-[hsl(var(--error))] hover:bg-[hsla(346,77%,49%,0.1)] transition-all cursor-pointer"
            title="Logout"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Start Chat Modal Overlay */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setModalSearchQuery(""); }} title="Start New Chat">
        <div className="space-y-4">
          <input
            type="text"
            value={modalSearchQuery}
            onChange={(e) => setModalSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full px-4 py-2.5 rounded-lg glass-input text-sm focus:outline-none"
          />

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {modalSearchQuery.trim() === "" ? (
              <div className="text-center py-8 text-[hsl(var(--text-muted))] text-xs">
                Type a query to search registered users
              </div>
            ) : isSearching ? (
              <div className="text-center py-8 text-[hsl(var(--text-muted))] text-xs">
                Searching users...
              </div>
            ) : searchedUsers.length === 0 ? (
              <div className="text-center py-8 text-[hsl(var(--text-muted))] text-xs">
                No users found
              </div>
            ) : (
              searchedUsers.map((profile) => (
                <button
                  key={profile._id}
                  onClick={() => startChatMutation.mutate(profile.authUserId)}
                  disabled={startChatMutation.isPending}
                  className="w-full p-2.5 rounded-xl border border-[hsl(var(--card-border))] bg-[hsla(240,10%,7%,0.4)] hover:bg-[hsl(var(--bg-tertiary))] flex items-center gap-3 text-left transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Avatar name={profile.displayName || profile.username} isOnline={profile.isOnline} size="w-10 h-10" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-[hsl(var(--text-main))] truncate">
                      {profile.displayName || profile.username}
                    </h4>
                    <p className="text-[10px] text-[hsl(var(--text-muted))] truncate">
                      @{profile.username}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
