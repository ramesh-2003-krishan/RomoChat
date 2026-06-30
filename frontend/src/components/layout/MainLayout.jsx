import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import EmptyState from "../common/EmptyState";
import Avatar from "../common/Avatar";
import { useAuthStore } from "../../features/auth/authStore";

const MainLayout = ({ conversations = [], activeChat, onSelectChat, mockMessages = [], onSendMessage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  
  const user = useAuthStore((state) => state.user);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mockMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (onSendMessage) {
      onSendMessage(inputText);
    }
    setInputText("");
  };

  return (
    <div className="w-screen h-screen flex bg-[hsl(var(--bg-primary))] overflow-hidden relative">
      {/* Sidebar Container */}
      <div
        className={`absolute md:relative z-30 h-full transition-transform duration-300 transform md:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          conversations={conversations}
          activeChatId={activeChat?.id}
          onSelectChat={(chat) => {
            onSelectChat(chat);
            // Auto close sidebar on mobile when a chat is selected
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        />
      </div>

      {/* Sidebar Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Chat / Content Container */}
      <div className="flex-1 h-full flex flex-col min-w-0">
        {activeChat ? (
          <>
            <Header
              activeChat={activeChat}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Messages Log area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[hsl(var(--bg-primary))] relative">
              {mockMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[hsl(var(--text-muted))]">
                  No messages in this chat yet. Start the conversation!
                </div>
              ) : (
                mockMessages.map((msg) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`flex gap-3 max-w-[80%] ${
                        isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      {!isMe && (
                        <Avatar
                          name={activeChat.isGroup ? activeChat.groupName : activeChat.otherParticipantName}
                          size="w-8 h-8"
                        />
                      )}
                      
                      <div>
                        <div
                          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? "bg-[hsl(var(--primary))] text-white rounded-tr-none shadow-lg shadow-[hsla(263,70%,50%,0.15)]"
                              : "bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-main))] rounded-tl-none border border-[hsl(var(--card-border))]"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p
                          className={`text-[9px] text-[hsl(var(--text-muted))] mt-1 ${
                            isMe ? "text-right" : "text-left"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              {/* Dummy bottom ref for scroll targets */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form panel */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-[hsl(var(--card-border))] bg-[hsla(240,10%,7%,0.4)] flex items-center gap-3"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 text-sm rounded-lg glass-input focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-lg bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] text-white shadow-md transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Minimal Mobile Header when empty */}
            <div className="h-16 border-b border-[hsl(var(--card-border))] px-4 flex items-center md:hidden bg-[hsl(var(--bg-secondary))]">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-[hsl(var(--bg-tertiary))] text-[hsl(var(--text-main))] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <span className="ml-3 font-bold text-sm text-[hsl(var(--text-main))]">RomoChat</span>
            </div>
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLayout;
