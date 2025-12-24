/*
 * @Author: 桂佳囿
 * @Date: 2025-07-11 23:09:48
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-24 01:38:41
 * @Description: 用户状态管理
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserInfo } from "@/types/user";

interface UserState {
  user: UserInfo;
  getUser: () => UserInfo;
  setUser: (user: Partial<UserInfo>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: {} as UserInfo,

      getUser: () => get().user,

      setUser: (payload) =>
        set((state) => ({
          user: {
            ...state.user,
            ...payload,
          },
        })),
      clearUser: () => set({ user: {} as UserInfo }),
    }),
    {
      name: "userInfo",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
