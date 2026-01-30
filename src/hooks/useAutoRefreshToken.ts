/*
 * @Author: 桂佳囿
 * @Date: 2026-01-25 22:00:53
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-26 00:55:11
 * @Description: 自动刷新 Token 的 Hook
 */
import { useEffect, useState } from "react";
import { refreshToken as refreshTokenService } from "@/services/auth";
import { useTokenStore } from "@/stores/token";
import { useUserStore } from "@/stores/user";
import { isValidToken } from "@/utils/public";

// 12小时刷新一次
const REFRESH_INTERVAL = 1000 * 60 * 60 * 12;

/**
 * 自动刷新 Token 的 Hook
 * @returns boolean isReady - 是否初始化完成
 */
export const useAutoRefreshToken = () => {
  const { setToken, setRefreshToken, clearToken } = useTokenStore();
  const { setUser } = useUserStore();
  // 控制初始化完成状态
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const fetchNewToken = async () => {
      const currentRefreshToken = useTokenStore.getState().refreshToken;
      // 如果没有 refreshToken，直接标记为 ready
      if (!isValidToken(currentRefreshToken)) {
        clearToken();
        setIsReady(true);
        return;
      }

      try {
        const res = await refreshTokenService(currentRefreshToken);
        if (res) {
          setToken(res.token);
          setRefreshToken(res.refreshToken);
          setUser(res.userInfo);
        }
      } catch (error) {
        console.error(error);
        // 如果 refreshToken 接口本身返回 401，http 拦截器通常会处理登出
      } finally {
        setIsReady(true);
      }
    };

    // 组件挂载时立即尝试刷新一次，保证 Token 新鲜度
    void fetchNewToken();

    // 设置定时器
    const timer = setInterval(() => {
      // 这里的调用不需要 finally setIsReady，因为已经 ready 了
      const currentRefreshToken = useTokenStore.getState().refreshToken;
      if (!isValidToken(currentRefreshToken)) {
        clearToken();
        return;
      }
      refreshTokenService(currentRefreshToken)
        .then((res) => {
          if (res) {
            setToken(res.token);
            setRefreshToken(res.refreshToken);
            setUser(res.userInfo);
          }
        })
        .catch((err) => console.error(err));
    }, REFRESH_INTERVAL);

    // 清理定时器
    return () => clearInterval(timer);
  }, []);

  return isReady;
};
