/*
 * @Author: 桂佳囿
 * @Date: 2025-12-24 15:49:07
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-24 15:53:11
 * @Description: 字典类型定义
 */

// 字典树节点类型
export interface DictTreeNode {
  children: DictTreeNode[];
  createTime: string;
  dictCode: string;
  dictId: string;
  dictName: string;
  dictType: string;
  dictValue: string;
  parentId: string;
  remark: string;
  sortOrder: number;
  status: number;
  updateTime: string;
}

// 字典列表节点类型
export interface DictListNode {
  createBy: string;
  createTime: string;
  dictCode: string;
  dictId: string;
  dictName: string;
  dictType: string;
  dictValue: string;
  parentId: string;
  remark: null;
  sortOrder: number;
  status: number;
  updateBy: null;
  updateTime: null;
  [property: string]: any;
}
