import { createContext, useContext } from "react";
import type { ThemeMode, Theme } from "@/types/Systemtheme";

export interface ThemeContextValue {
  currentTheme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: "light",
  themeMode: "system",
  setThemeMode: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);
