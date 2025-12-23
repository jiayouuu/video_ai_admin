/*
 * @Author: 桂佳囿
 * @Date: 2025-07-11 22:11:42
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:43:41
 * @Description: 应用入口文件
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import "@ant-design/v5-patch-for-react-19";
import { ConfigProvider } from "antd";
import { AntdAppProvider } from "@/providers/AntdAppProvider";
import zhCN from "antd/locale/zh_CN";
import "@/assets/index.scss";

if (import.meta.env.VITE_ENABLE_UPDATE) {
  import("@/utils/update").then((mod) => {
    mod.start(60 * 1000, 10 * 60 * 1000);
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN}>
      <AntdAppProvider>
        <RouterProvider router={router} />
      </AntdAppProvider>
    </ConfigProvider>
  </StrictMode>
);
