import React from "react";
import Avatar from "../common/Avatar";

const Header = ({ activeChat, onToggleSidebar, typingStates }) => {
  if (!activeChat) return null;

  const chatName = activeChat.isGroup ? activeChat.groupName : activeChat.otherParticipantName;
  const isOnline = activeChat.isOnline || false;

  // Resolve if the other participant is typing
  const conversationTyping = typingStates?.[activeChat.id] || {};
  const otherTypingIds = Object.keys(conversationTyping).filter((id) => conversationTyping[id]);
  const isTyping = otherTypingIds.length > 0;

  return (
    <div className="glass-panel sticky top-0 z-40 border-x-0 border-t-0 h-16 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar for mobile screens */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-main))] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Avatar name={chatName} isOnline={isOnline} size="w-10 h-10" />
        
        <div>
          <h2 className="text-sm font-bold text-[hsl(var(--text-main))] leading-tight">
            {chatName}
          </h2>
          <p className="text-[10px] text-[hsl(var(--text-muted))] flex items-center gap-1.5 mt-0.5">
            {isTyping ? (
              <>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))] animate-ping" />
                <span className="text-[hsl(var(--primary))] font-bold">typing...</span>
              </>
            ) : (
              <>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[hsl(var(--success))]' : 'bg-zinc-500'}`} />
                {isOnline ? "Online" : "Offline"}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))] transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header;
