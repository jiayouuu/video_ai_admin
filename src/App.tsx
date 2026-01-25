/*
 * @Author: 桂佳囿
 * @Date: 2025-07-11 22:11:42
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-25 22:31:47
 * @Description: 应用根组件
 */

import { Outlet } from "react-router-dom";
import { NavigateProvider } from "@/providers/NavigateProvider";
import { useAutoRefreshToken } from "@/hooks/useAutoRefreshToken";
import { FullSpin } from "@/components/fullSpin";

const App = () => {
  // 自动刷新 token 并获取用户信息
  const isReady = useAutoRefreshToken();
  return (
    <NavigateProvider>
      {isReady ? <Outlet /> : <FullSpin />}
    </NavigateProvider>
  );
};

export default App;
