/*
 * @Author: 桂佳囿
 * @Date: 2025-07-11 22:11:42
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-25 17:45:33
 * @Description: 应用根组件
 */

import { Outlet } from "react-router-dom";
import { NavigateProvider } from "@/providers/NavigateProvider";

const App = () => {
  return (
    <>
      <NavigateProvider>
        <Outlet />
      </NavigateProvider>
    </>
  );
};

export default App;
