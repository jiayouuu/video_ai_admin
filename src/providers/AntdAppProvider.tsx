import { App, ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { messageBridge } from "@/bridges/messageBridge";
import { useEffect, type ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import { ThemeContext } from "@/contexts/themeContext";

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
  const [currentTheme] = useSystemTheme("system");

  useEffect(() => {
    document.documentElement.dataset.theme = currentTheme;
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
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
