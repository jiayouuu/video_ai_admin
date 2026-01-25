/*
 * @Author: 桂佳囿
 * @Date: 2025-07-14 09:24:21
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-25 23:57:25
 * @Description: HTTP 请求封装
 */

import axios from "axios";
import type {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { useTokenStore } from "@/stores/token";
import type { ResponseData } from "@/types/response";
import { ResponseCode } from "@/const/responseCodes";
import { ResponseMsg } from "@/const/responseMsgs";
import { message } from "@/bridges/messageBridge";
import { requestCanceler, genRequestKey } from "@/utils/requestCanceler";
import { navigate } from "@/bridges/navigateBridge";

const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_HOST}${import.meta.env.VITE_API_PREFIX}`,
  timeout: 5000,
});

const defaultErrorMessage = "服务异常，请稍后重试";

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const key = config.cancelKey ?? genRequestKey(config);
    const controller = requestCanceler.create(key);
    config.signal = controller.signal;
    config.__requestKey = key;
    const { token } = useTokenStore.getState();
    if (token && !config.headers.Authorization && !config.public) {
      config.headers!.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const key = response.config.__requestKey;
    if (key) requestCanceler.remove(key);
    const { code, msg, data } = response.data;
    if (code === ResponseCode.UNAUTHORIZED) {
      message.error("登录状态已过期，请重新登录");
      requestCanceler.cancelAll();
      navigate("/auth/login", { replace: true });
      return Promise.reject(response.data);
    }
    if (code !== ResponseCode.SUCCESS) {
      message.error(msg || ResponseMsg[code] || defaultErrorMessage);
      return Promise.reject(response.data);
    }
    return data;
  },
  (error: AxiosError) => {
    const key = error.config?.__requestKey;
    if (key) requestCanceler.remove(key);
    // 被取消的请求
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }
    // 未授权，跳转登录
    if (error.status === 401) {
      message.error("登录状态已过期，请重新登录");
      requestCanceler.cancelAll();
      navigate("/auth/login", { replace: true });
      return Promise.reject(error);
    }
    message.error(defaultErrorMessage);
    return Promise.reject(error);
  },
);

export { http };
