/*
 * @Author: 桂佳囿
 * @Date: 2025-12-12 13:56:36
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-25 19:40:54
 * @Description: 路由配置
 */
import App from "@/App";
import { lazyLoad } from "@/components/LazyLoad";
import AppLayout from "@/components/layout";
import { type RouteObject, Navigate } from "react-router-dom";
import { authLoader } from "@/router/loaders/authLoader";

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        element: <AppLayout />,
        loader: authLoader,
        children: [
          {
            index: true,
            element: <Navigate to="/user" replace />,
          },
          {
            path: "user",
            element: lazyLoad(() => import("@/views/user")),
          },
          {
            path: "dictionary",
            element: lazyLoad(() => import("@/views/dictionary")),
          },
        ],
      },
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
