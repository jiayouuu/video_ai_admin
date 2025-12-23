/*
 * @Author: 桂佳囿
 * @Date: 2025-07-11 23:09:48
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:41:56
 * @Description: 用户状态管理
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/user";

interface UserState extends User {
  getUser: () => User;
  setUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      id: "",
      nickname: "",
      token: "",
      getUser: () => get(),
      setUser: (user) => set(() => ({ ...user })),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
