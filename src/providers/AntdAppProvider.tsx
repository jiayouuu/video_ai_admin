import { App, ConfigProvider, theme } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import { messageBridge } from "@/bridges/messageBridge";
import { useEffect, type ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import type { ThemeMode } from "@/types/Systemtheme";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { ThemeContext } from "@/contexts/themeContext";
import { useThemeModeStore } from "@/stores/systemTheme";

// 配置全局 dayjs 为中国时区
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("zh-cn");
dayjs.tz.setDefault("Asia/Shanghai");

const AntdInner = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp();
  messageBridge.set(message);
  return <>{children}</>;
};

export const AntdProvider = ({ children }: { children: ReactNode }) => {
  const { themeMode, setThemeMode: setThemeModeState } = useThemeModeStore();
  const [currentTheme, setThemeMode] = useSystemTheme(themeMode);

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    setThemeMode(mode);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themeMode,
        setThemeMode: handleSetThemeMode,
      }}
    >
      <ConfigProvider
        locale={zhCN}
        theme={{
          algorithm:
            currentTheme === "dark"
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
        }}
      >
        <App style={{ height: "100%" }} message={{ maxCount: 1 }}>
          <AntdInner>{children}</AntdInner>
        </App>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
