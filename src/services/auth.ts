/*
 * @Author: 桂佳囿
 * @Date: 2025-11-10 10:01:49
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-24 10:44:54
 * @Description: 鉴权服务
 */

import { type UserInfo } from "@/types/user";
import { http } from "@/utils/http";

const API = {
  // 获取验证码
  getCaptcha: "/auth/captcha",
  // 校验图形验证码
  verifyCaptcha: "/auth/verifyCaptcha",
  // 登录
  login: "/auth/login",
};

/**
 * @description: 获取图形验证码
 * @param {*} Promise
 * @return {*}
 */
export const getCaptcha = (): Promise<{
  captchaKey: string;
  captchaImage: string;
  expireSeconds: string;
}> => {
  return http.get(API.getCaptcha, { public: true });
};

/**
 * @description: 校验图形验证码
 * @return {*}
 */
export const verifyCaptcha = (params: {
  captchaKey: string;
  captcha: string;
}): Promise<{ valid: boolean; message: string }> => {
  return http.post(API.verifyCaptcha, params, { public: true });
};

/**
 * @description: 用户登录
 * @param {object} data 登录数据
 * @return {*}
 */
export const login = (params: {
  loginType: string; // password || other types
  username: string;
  password: string;
  captcha: string;
  captchaKey: string;
}): Promise<{ userInfo: UserInfo; token: string }> => {
  return http.post(API.login, params, { public: true });
};
