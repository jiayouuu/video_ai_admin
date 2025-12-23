/*
 * @Author: 桂佳囿
 * @Date: 2025-12-19 15:11:40
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:40:50
 * @Description: Antd 顶层 App Provider
 * 作用：
 * 1. 统一注册 message / modal / notification
 * 2. 自动读取 ConfigProvider 的上下文（主题、语言等）
 * 3. 应该禁止使用 antd 静态方法，避免上下文失效问题
 */

import { messageBridge } from "@/bridges/messageBridge";
import { App } from "antd";
import type { ReactNode } from "react";

const AntdAppInner = ({ children }: { children: ReactNode }) => {
  const { message } = App.useApp();
  messageBridge.set(message);
  return <>{children}</>;
};

export const AntdAppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <App style={{ height: "100%" }}>
      <AntdAppInner>{children}</AntdAppInner>
    </App>
  );
};
