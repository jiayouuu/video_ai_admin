/*
 * @Author: 桂佳囿
 * @Date: 2025-12-24 13:31:35
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-26 00:31:47
 * @Description: 字典服务
 */

import { http } from "@/utils/http";
import type { DictTreeNode, DictListNode } from "@/types/dictionary";
import type { PaginatedData } from "@/types/response";

const API = {
  // 获取字典树
  getDictTree: "/dictionary/tree",
  // 分页获取字典列表
  getDictList: "/dictionary/list",
  // 根据字典类型查询
  getDictByType: "/dictionary/type",
  // 根据字典id获取字典详情
  getDictById: "/dictionary/getById",
  // 根据字典code获取字典详情
  getDictByCode: "/dictionary/getByCode",
  // 新增字典
  createDict: "/dictionary/create",
  // 修改字典
  updateDict: "/dictionary/update",
  // 删除字典
  deleteDict: "/dictionary/delete",
  // 批量删除字典
  deleteDicts: "/dictionary/batch-delete",
  // 根据父ID查询子字典列表
  getDictByParentId: "/dictionary/children/list",
};

/**
 * @description:  获取字典树
 * @return {*}
 */
export const getDictTree = (dictType: string): Promise<Array<DictTreeNode>> => {
  return http.get(API.getDictTree, {
    params: { dictType },
  });
};

/**
 * @description: 分页获取字典列表
 * @return {*}
 */
export const getDictList = (params: {
  dictCode: string;
  dictName: string;
  dictType: string;
  page: number;
  parentId: string;
  size: number;
  status: number;
}): Promise<PaginatedData<DictListNode>> => {
  return http.post(API.getDictList, params);
};

/**
 * @description: 根据字典类型查询
 * @param {string} dictType
 * @return {*}
 */
export const getDictByType = (dictType: string): Promise<DictListNode[]> => {
  return http.get(API.getDictByType, {
    params: { dictType },
  });
};

/**
 * @description: 根据字典id获取字典详情
 * @param {string} dictId
 * @return {*}
 */
export const getDictById = (dictId: string): Promise<DictListNode> => {
  return http.get(API.getDictById, {
    params: { dictId },
  });
};

/**
 * @description: 根据字典code获取字典详情
 * @param {string} dictCode
 * @return {*}
 */
export const getDictByCode = (dictCode: string): Promise<DictListNode> => {
  return http.get(API.getDictByCode, {
    params: { dictCode },
  });
};

/**
 * @description: 新增字典
 * @return {*}
 */
export const createDict = (params: {
  dictCode: string;
  dictName: string;
  dictType: string;
  dictValue: string;
  parentId: string;
  remark: string;
  sortOrder: number;
  status: number;
}): Promise<DictListNode> => {
  return http.post(API.createDict, params);
};

/**
 * @description: 修改字典
 * @return {*}
 */
export const updateDict = (params: {
  dictCode: string;
  dictId: string;
  dictName: string;
  dictType: string;
  dictValue: string;
  parentId: string;
  remark: string;
  sortOrder: number;
  status: number;
}): Promise<DictListNode> => {
  return http.put(API.updateDict, params);
};

/**
 * @description: 删除字典
 * @param {string} dictId
 * @return {*}
 */
export const deleteDict = (dictId: string): Promise<void> => {
  return http.delete(API.deleteDict, {
    params: { dictId },
  });
};

/**
 * @description: 批量删除字典
 * @param {string} dictIds
 * @return {*}
 */
export const deleteDicts = (dictIds: string[]): Promise<void> => {
  return http.delete(API.deleteDicts, {
    data: dictIds,
  });
};

/**
 * @description: 根据父ID查询子字典列表
 * @param {string} parentId
 * @return {*}
 */
export const getDictByParentId = (
  parentId: string
): Promise<DictListNode[]> => {
  return http.get(API.getDictByParentId, {
    params: { parentId },
  });
};
