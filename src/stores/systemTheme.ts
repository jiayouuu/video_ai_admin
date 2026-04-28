import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ThemeMode } from "@/types/Systemtheme";
import { encStorage } from "@/utils/encStorage";

interface ThemeModeState {
  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
}

export const useThemeModeStore = create<ThemeModeState>()(
  persist(
    (set) => ({
      themeMode: "system",
      setThemeMode: (themeMode: ThemeMode) =>
        set({
          themeMode,
        }),
    }),
    {
      name: "themeMode",
      storage: createJSONStorage(() => encStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
    },
  ),
);
