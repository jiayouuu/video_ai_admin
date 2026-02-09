/*
 * @Author: 桂佳囿
 * @Date: 2026-01-07 15:16:23
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-02-09 13:31:19
 * @Description: 幼儿园管理服务
 */

import { http } from "@/utils/http";
import type {
  BaseKindergartenInfo,
  UpdateKindergartenInfo,
  CreateKindergartenInfo,
} from "@/types/kindergarten";
import type { PaginatedData } from "@/types/response";

const API = {
  // 根据id获取幼儿园基本信息
  kindergartenById: "/kindergarten/getById",
  // 幼儿园分页查询
  kindergartenlist: "/kindergarten/list",
  // 修改幼儿园信息
  updateKindergarten: "/kindergarten/update",
  // 新增幼儿园
  createKindergarten: "/kindergarten/create",
  // 删除幼儿园接口
  deleteKindergarten: "/kindergarten/delete",
  // 获取全部的幼儿园列表
  kindergartenListAll: "/kindergarten/listAll",
};

/**
 * @description: 获取幼儿园基本信息
 * @param {*} Promise
 * @return {*}
 */
export const getKindergarten = (
  kindergartenId: string,
): Promise<BaseKindergartenInfo> => {
  return http.get(API.kindergartenById, {
    params: { kindergartenId },
  });
};

/**
 * @description: 幼儿园分页查询
 * @param {*} Promise
 * @return {*}
 */
export const getKindergartenList = (params: {
  // 幼儿园名称
  kindergartenName: string;
  // 幼儿园类型
  kindergartenType: string;
  // 幼儿园级别
  level: string;
  // 省份
  provinceName: string;
  // 城市
  cityName: string;
  // 区县
  districtName: string;
  // 状态0封禁1正常
  status: string;
  page: number;
  size: number;
}): Promise<PaginatedData<BaseKindergartenInfo>> => {
  return http.post(API.kindergartenlist, params);
};

/**
 * @description: 修改幼儿园信息
 * @param {*} Promise
 * @return {*}
 */
export const updateKindergarten = (
  data: UpdateKindergartenInfo,
): Promise<BaseKindergartenInfo> => {
  return http.put(API.updateKindergarten, data);
};

/**
 * @description: 新增幼儿园
 * @param {*} Promise
 * @return {*}
 */
export const createKindergarten = (
  data: CreateKindergartenInfo,
): Promise<BaseKindergartenInfo> => {
  return http.post(API.createKindergarten, data);
};

/**
 * @description: 删除幼儿园接口
 * @param {*} Promise
 * @return {*}
 */
export const deleteKindergarten = (kindergartenId: string): Promise<null> => {
  return http.delete(API.deleteKindergarten, {
    params: { kindergartenId },
  });
};

/**
 * @description: 获取全部的幼儿园列表
 * @param {*} Promise
 * @return {*}
 */
export const getKindergartenListAll = (params: {
  kindergartenName: string;
  kindergartenType: string;
  level: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  status: number;
}): Promise<BaseKindergartenInfo[]> => {
  return http.post(API.kindergartenListAll, params);
};
