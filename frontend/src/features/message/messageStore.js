import { create } from "zustand";
import { getMessagesAPI, sendMessageAPI } from "../../services/chatService";

export const useMessageStore = create((set, get) => ({
  messages: {}, // { [conversationId]: [message1, message2, ...] }
  activeMessages: [],
  typingStates: {}, // { [conversationId]: { [userId]: boolean } }
  isLoading: false,
  error: null,

  fetchMessageHistory: async (conversationId) => {
    if (!conversationId) return;
    set({ isLoading: true, error: null });
    try {
      const data = await getMessagesAPI(conversationId);
      if (data.success) {
        const history = data.messages || [];
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: history,
          },
          activeMessages: history,
          isLoading: false,
        }));
      } else {
        throw new Error(data.message || "Failed to load messages");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to load messages";
      set({ error: errMsg, isLoading: false });
    }
  },

  sendMessage: async (conversationId, content) => {
    if (!conversationId || !content) return;
    set({ error: null });
    try {
      const data = await sendMessageAPI({ conversationId, content });
      if (data.success && data.message) {
        const newMsg = data.message;
        
        // Optimistically append the sent message to local state
        set((state) => {
          const currentList = state.messages[conversationId] || [];
          const updatedList = [...currentList, newMsg];
          return {
            messages: {
              ...state.messages,
              [conversationId]: updatedList,
            },
            activeMessages: updatedList,
          };
        });
        return { success: true };
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to send message";
      set({ error: errMsg });
      return { success: false, error: errMsg };
    }
  },

  addMessageToHistory: (conversationId, newMsg) => {
    if (!conversationId || !newMsg) return;
    set((state) => {
      const currentList = state.messages[conversationId] || [];
      const exists = currentList.some((m) => (m._id || m.id) === (newMsg._id || newMsg.id));
      if (exists) return {};

      const updatedList = [...currentList, newMsg];
      
      const activeUpdated = (state.activeMessages.length > 0 && state.activeMessages[0].conversationId === conversationId) 
        ? updatedList 
        : state.activeMessages;

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedList,
        },
        activeMessages: activeUpdated,
      };
    });
  },

  setTypingStatus: (conversationId, userId, isTyping) => {
    if (!conversationId || !userId) return;
    set((state) => {
      const conversationTyping = state.typingStates[conversationId] || {};
      const updatedTyping = {
        ...conversationTyping,
        [userId]: isTyping,
      };

      // Clean up falsy states to avoid accumulation
      if (!isTyping) {
        delete updatedTyping[userId];
      }

      return {
        typingStates: {
          ...state.typingStates,
          [conversationId]: updatedTyping,
        },
      };
    });
  },

  clearActiveMessages: () => set({ activeMessages: [] }),
}));
