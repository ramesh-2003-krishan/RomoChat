import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "default",
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("theme-cyberpunk", "theme-emerald", "theme-light");
    if (newTheme !== "default") {
      document.documentElement.classList.add(`theme-${newTheme}`);
    }
    set({ theme: newTheme });
  },
}));
