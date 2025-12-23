/*
 * @Author: 桂佳囿
 * @Date: 2025-12-23 20:51:48
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-23 22:20:32
 * @Description: 公共工具方法
 */

/**
 * @description: 生成 URLSearchParams 字符串
 * @param {Record} params - 参数对象
 * @return {*} {string} URLSearchParams 字符串
 */
export const genSearchParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};

