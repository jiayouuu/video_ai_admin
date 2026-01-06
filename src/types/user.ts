/*
 * @Author: 桂佳囿
 * @Date: 2025-07-10 19:47:35
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-06 23:54:32
 * @Description: 用户类型定义
 */

export interface Resource {
  resourceId: string;
  type: string;
  resourceUrl: string;
  resourceDesc: string;
}

export interface UserOutInfoBo {
  roleId: string;
  roleName: string;
  roleLevel: number;
  kindergartenName: string;
  shortName: string;
  englishName: string;
  establishmentDate: string;
  kindergartenType: string;
  level: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  detailedAddress: string;
  postalCode: string;
  telephone: string;
  officialWebsite: string;
  email: string;
  createTime: string;
  principal: string;
  principalPhone: string;
  status: string;
  mainPhone: string;
  tokenOneNumber: string;
  tokenTwoNumber: string;
  tokenThreeNumber: string;
  tokenFourNumber: string;
  tokenFiveNumber: string;
}

export interface UserInfo {
  userId: string;
  username: string;
  faceImage: string;
  nickname: string;
  createTime: string;
  grade: string;
  className: string;
  status: string;
  phoneNumber: string;
  resources: Resource[];
  userOutInfoBo: UserOutInfoBo;
}

// 用户列表项
export interface User {
  /**
   * 城市名称
   */
  cityName: string;
  /**
   * 班级
   */
  className: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 区县名称
   */
  districtName: string;
  /**
   * 幼儿园英文名称
   */
  englishName: string;
  /**
   * 建园日期
   */
  establishmentDate: string;
  /**
   * 头像地址
   */
  faceImage: string;
  /**
   * 年级
   */
  grade: string;
  /**
   * 幼儿园id
   */
  kindergartenId: string;
  /**
   * 幼儿园名称
   */
  kindergartenName: string;
  /**
   * 幼儿园类型
   */
  kindergartenType: string;
  /**
   * 等级
   */
  level: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 省份名称
   */
  provinceName: string;
  /**
   * 角色id
   */
  roleId: string;
  /**
   * 角色等级
   */
  roleLevel: number;
  /**
   * 角色名称
   */
  roleName: string;
  /**
   * 幼儿园简称
   */
  shortName: string;
  /**
   * 状态0正常1封禁
   */
  status: string;
  /**
   * 令牌数量
   */
  tokenNumber: number;
  /**
   * 令牌总数
   */
  tokenTotalNumber: number;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}
