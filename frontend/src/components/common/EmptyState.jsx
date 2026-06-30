import React from "react";

const EmptyState = ({ title = "No conversation selected", description = "Choose a chat from the sidebar or start a new conversation to begin messaging." }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[hsl(var(--bg-primary))] animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-[hsla(263,70%,50%,0.08)] border border-[hsla(263,70%,50%,0.2)] flex items-center justify-center mb-6 text-3xl shadow-lg">
        💬
      </div>
      <h3 className="text-xl font-bold tracking-tight text-gradient mb-2">
        {title}
      </h3>
      <p className="text-[hsl(var(--text-muted))] text-sm max-w-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;
