import { redirect } from "react-router-dom";
import { useTokenStore } from "@/stores/token";

/**
 * @description: 鉴权加载器
 * @return {*}
 */
export const authLoader = async (): Promise<any> => {
  const { token } = useTokenStore.getState();
  if (!token) {
    throw redirect("/auth/login");
  }
  return null;
};
