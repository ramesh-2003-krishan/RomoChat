import React from "react";
import { useNotificationStore } from "../../features/notification/notificationStore";

const ToastContainer = () => {
  const { toasts, removeToast } = useNotificationStore();

  const handleToastClick = (toast) => {
    if (toast.conversationId) {
      const event = new CustomEvent("select_conversation", {
        detail: { id: toast.conversationId },
      });
      window.dispatchEvent(event);
    }
    removeToast(toast.id);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => handleToastClick(t)}
          className="glass-panel p-4 rounded-xl shadow-2xl flex flex-col gap-1 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer pointer-events-auto border-l-4 border-l-[hsl(var(--primary))] animate-slide-up"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[hsl(var(--text-main))]">{t.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(t.id);
              }}
              className="text-[10px] text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-main))]"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-[hsl(var(--text-muted))] truncate">{t.body}</p>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
