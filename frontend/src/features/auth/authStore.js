import { create } from "zustand";
import { loginAPI, registerAPI } from "../../services/authService";

const getSavedUser = () => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getSavedToken = () => {
  return localStorage.getItem("token") || null;
};

export const useAuthStore = create((set) => ({
  user: getSavedUser(),
  token: getSavedToken(),
  isAuthenticated: !!getSavedToken(),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await loginAPI(email, password);
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        set({
          token: data.token,
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return { success: true };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Invalid credentials";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await registerAPI(username, email, password);
      if (data.success) {
        set({ isLoading: false });
        return { success: true };
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Registration failed";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));
