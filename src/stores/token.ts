import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encStorage } from "@/utils/encStorage";

interface TokenState {
  token: string;
  refreshToken: string;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  clearToken: () => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set) => ({
      token: "",
      refreshToken: "",
      setToken: (token) =>
        set({
          token,
        }),
      setRefreshToken: (refreshToken) =>
        set({
          refreshToken,
        }),
      clearToken: () => set({ token: "", refreshToken: "" }),
    }),
    {
      name: "token",
      storage: createJSONStorage(() => encStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
