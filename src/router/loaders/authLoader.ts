import { redirect } from "react-router-dom";
import { useTokenStore } from "@/stores/token";
import { isValidToken } from "@/utils/public";

/**
 * @description: 鉴权加载器
 * @return {*}
 */
export const authLoader = async (): Promise<any> => {
  const { token, refreshToken, clearToken } = useTokenStore.getState();
  if (!isValidToken(token) || !isValidToken(refreshToken)) {
    clearToken();
    throw redirect("/auth/login");
  }
  return null;
};
