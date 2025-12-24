import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface TokenState {
  token: string;
  getToken: () => string;
  setToken: (user: string) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      token: "",
      getToken: () => get().token,

      setToken: (token) =>
        set({
          token,
        }),
      clearToken: () => set({ token: "" }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);
