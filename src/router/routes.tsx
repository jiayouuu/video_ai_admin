/*
 * @Author: 桂佳囿
 * @Date: 2025-12-12 13:56:36
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-23 20:34:26
 * @Description: 路由配置
 */
import App from "@/App";
import { lazyLoad } from "@/components/LazyLoad";
import { type RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: "auth/login",
        element: lazyLoad(() => import("@/views/auth/login")),
      },
      {
        path: "auth/register",
        element: lazyLoad(() => import("@/views/auth/register")),
      },
    ],
  },
  {
    path: "*",
    element: lazyLoad(() => import("@/views/notFound")),
  },
];
