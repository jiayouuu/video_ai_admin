import { createContext, useContext } from "react";

export type AppTheme = "light" | "dark";

export interface ThemeContextValue {
  currentTheme: AppTheme;
}

export const ThemeContext = createContext<ThemeContextValue>({
  currentTheme: "light",
});

export const useAppTheme = () => useContext(ThemeContext);
