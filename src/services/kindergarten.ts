/*
 * @Author: 桂佳囿
 * @Date: 2026-01-07 15:16:23
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-07 15:53:28
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
};

/**
 * @description: 获取幼儿园基本信息
 * @param {*} Promise
 * @return {*}
 */
export const getKindergarten = (
  kindergartenId: string
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
  kindergartenName: string;
  kindergartenType: string;
  level: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  status: string; //状态0封禁1正常
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
  data: UpdateKindergartenInfo
): Promise<BaseKindergartenInfo> => {
  return http.put(API.updateKindergarten, data);
};

/**
 * @description: 新增幼儿园
 * @param {*} Promise
 * @return {*}
 */
export const createKindergarten = (
  data: CreateKindergartenInfo
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
