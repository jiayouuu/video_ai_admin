/*
 * @Author: 桂佳囿
 * @Date: 2026-01-07 15:17:06
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-07 15:50:40
 * @Description: 幼儿园类型定义
 */

// 基本幼儿园信息
export interface BaseKindergartenInfo {
  // 城市名称
  cityName: string;
  createTime: string;
  // 详细地址
  detailedAddress: string;
  // 区县名称
  districtName: string;
  // 电子邮箱
  email: string;
  // 英文名称
  englishName: string;
  // 建园日期
  establishmentDate: string;
  // 幼儿园id
  kindergartenId: string;
  // 幼儿园全称
  kindergartenName: string;
  // 幼儿园类型，公办、民办
  kindergartenType: string;
  // 幼儿园等级
  level: string;
  // 幼儿园管理员电话
  mainPhone: string;
  // 官方网站地址
  officialWebsite: string;
  // 邮政编码
  postalCode: string;
  // 校长
  principal: string;
  // 校长电话
  principalPhone: string;
  // 省份名称
  provinceName: string;
  // 幼儿园简称
  shortName: string;
  // 状态 0封禁，1启用
  status: number;
  // 联系电话
  telephone: string;
  // 积分总数
  tokenNumber: string;
  // 已经分配积分
  tokenShareNumber: string;
}

// 修改幼儿园信息时使用的类型
export type UpdateKindergartenInfo = Omit<BaseKindergartenInfo, "createTime">;

// 新增幼儿园时使用的类型
export type CreateKindergartenInfo = Omit<
  BaseKindergartenInfo,
  "kindergartenId" | "createTime" | "tokenNumber" | "tokenShareNumber"
>;
