/*
 * @Author: 桂佳囿
 * @Date: 2026-05-11 16:50:47
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-05-11 19:04:23
 * @Description: 监控服务
 */

import { http } from "@/utils/http";
import type {
  DayStatus,
  SemaphoreStatus,
  CallTrend,
  LogItem,
} from "@/types/monitor";
import type { PaginatedData } from "@/types/response";

const API = {
  // 获取当日调用情况（需要轮询1分钟进行调用）
  modelDayStats: "/overview/modelDayStats",
  // 获取3D实时调用记录
  modelCallRecords: "/model3d/semaphore/status",
  // 获取视频实时调用记录
  videoCallRecords: "/kling/semaphore/status",
  // 模型调用记录统计
  callTrend: "/overview/callTrend",
  // 分页获取日志记录
  logList: "/log/list",
};

/**
 * @description: 获取当日调用情况
 * @param {time} time - 日期，格式为 "YYYY-MM-DD"
 * @return {*}
 */
export const getModelDayStats = (time: string): Promise<Array<DayStatus>> => {
  return http.get(API.modelDayStats, {
    params: { time },
    cancelKey: "modelDayStats" + time,
  });
};

/**
 * @description: 获取3D实时调用记录
 * @return {*}
 */
export const getModelCallRecords = (): Promise<SemaphoreStatus> => {
  return http.get(API.modelCallRecords);
};

/**
 * @description: 获取视频实时调用记录
 * @return {*}
 */
export const getVideoCallRecords = (): Promise<SemaphoreStatus> => {
  return http.get(API.videoCallRecords);
};

/**
 * @description: 模型调用记录统计
 * @return {*}
 */
export const getCallTrend = (params: {
  type: "video" | "3D";
  timeType: "year" | "month" | "day";
  time: string; // 日期，格式为 "YYYY-MM-DD" 或 "YYYY-MM" 或 "YYYY"
}): Promise<Array<CallTrend>> => {
  return http.post(API.callTrend, params, {
    cancelKey: "callTrend" + JSON.stringify(params),
  });
};

/**
 * @description: 分页获取日志记录
 * @return {*}
 */
export const getLogList = (params: {
  /**
   * 请求方法类型
   */
  method: string;
  /**
   * 用户名称模糊查询
   */
  nickName: string;
  page: string;
  /**
   * 请求路径
   */
  path: string;
  /**
   * 结束时间
   */
  requestTimeEnd: string;
  /**
   * 开始时间
   */
  requestTimeStart: string;
  size: string;
  /**
   * 是否成功
   */
  success: string;
  /**
   * 类型login:登录,select:查询,update:修改,delete:删除,save新增
   */
  type: string;
  /**
   * 用户id查询
   */
  userId: string;
}): Promise<PaginatedData<LogItem>> => {
  return http.post(API.logList, params);
};
