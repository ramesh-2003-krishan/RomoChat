import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../features/auth/authStore";

const formatTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return "";
  }
};

const Sidebar = ({ conversations = [], activeChatId, onSelectChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuthStore();

  const filteredConversations = conversations.filter((c) => {
    const name = c.isGroup ? c.groupName : c.otherParticipantName;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full md:w-80 h-full bg-[hsl(var(--bg-secondary))] flex flex-col border-r border-[hsl(var(--card-border))]">
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-[hsl(var(--card-border))]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[hsl(var(--primary))] to-[hsl(var(--accent))] flex items-center justify-center font-bold text-white shadow-md text-sm">
            R
          </div>
          <span className="text-md font-bold tracking-tight text-gradient">
            RomoChat
          </span>
        </div>
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
          filteredConversations.map((chat) => {
            const chatName = chat.isGroup ? chat.groupName : chat.otherParticipantName;
            const isActive = chat.id === activeChatId;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[hsla(263,70%,50%,0.15)] border border-[hsla(263,70%,50%,0.25)]"
                    : "hover:bg-[hsl(var(--bg-tertiary))] border border-transparent"
                }`}
              >
                <Avatar name={chatName} isOnline={chat.isOnline} size="w-11 h-11" />
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-xs font-bold text-[hsl(var(--text-main))] truncate">
                      {chatName}
                    </h4>
                    <span className="text-[9px] text-[hsl(var(--text-muted))]">
                      {formatTime(chat.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[hsl(var(--text-muted))] truncate">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="flex-shrink-0 h-4 min-w-[16px] rounded-full bg-[hsl(var(--primary))] text-[8px] font-bold text-white flex items-center justify-center px-1">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            );
          })
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
    </div>
  );
};

export default Sidebar;
