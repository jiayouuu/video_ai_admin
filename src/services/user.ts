/*
 * @Author: 桂佳囿
 * @Date: 2025-11-14 23:24:03
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-06 23:46:46
 * @Description: 用户服务
 */

import type { PaginatedData } from "@/types/response";
import type { User } from "@/types/user";
import { http } from "@/utils/http";

const API = {
  // 用户列表
  userList: "/users/list",
  // 根据id获取用户信息
  userInfo: "/users/getById",
  // 修改头像地址
  updateFaceImage: "/users/avatar/upload/{userId}",
  // 重置用户密码
  resetPassword: "/users/resetPassword/{userId}",
  // 修改用户状态
  updateStatus: "/users/status",
  // 新建用户
  createUser: "/users/create",
  // 删除用户
  deleteUser: "/users/delete/{userId}",
};

/**
 * @description: 获取用户列表
 * @param {*} Promise
 * @return {*}
 */
export const getUserList = (params: {
  // 班级
  className: string;
  // 年级
  grade: string;
  // 用户昵称模糊查询
  nickname: string;
  //  状态0正常1封禁
  status: string;
  // 用户名模糊查询
  username: string;
  page: number;
  size: number;
}): Promise<PaginatedData<User>> => {
  return http.post(API.userList, params);
};

/**
 * @description: 根据id获取用户信息
 * @param {*} userId
 * @return {*}
 */
export const getUserInfoById = (userId: string): Promise<User> => {
  return http.get(API.userInfo, { params: { userId } });
};

/**
 * @description: 修改头像地址
 * @param {*} userId
 * @param {*} file
 * @return {*}
 */
export const updateFaceImage = (params: {
  userId: string;
  file: File;
}): Promise<User> => {
  const url = API.updateFaceImage.replace("{userId}", params.userId);
  const formData = new FormData();
  formData.append("file", params.file);
  return http.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * @description: 重置用户密码
 * @param {*} userId
 * @return {*}
 */
export const resetPassword = (userId: string): Promise<void> => {
  const url = API.resetPassword.replace("{userId}", userId);
  return http.put(url);
};

/**
 * @description: 修改用户状态
 * @param {*} userId
 * @param {*} status
 * @return {*}
 */
export const updateUserStatus = (params: {
  userId: string;
  status: string;
}): Promise<void> => {
  return http.put(API.updateStatus, null, {
    params,
  });
};

/**
 * @description: 新建用户
 * @param {*} data
 * @return {*}
 */
export const createUser = (data: {
  phoneNumber: string;
  nickname: string;
  grade: string;
  className: string;
  kindergartenId: string;
  faceImage?: string;
}): Promise<User> => {
  return http.post(API.createUser, data);
};

/**
 * @description: 删除用户
 * @param {*} userId
 * @return {*}
 */
export const deleteUser = (userId: string): Promise<void> => {
  const url = API.deleteUser.replace("{userId}", userId);
  return http.delete(url);
};
