/*
 * @Author: 桂佳囿
 * @Date: 2025-07-10 19:47:35
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-24 01:17:25
 * @Description: 用户类型定义
 */

export interface Resource {
  resourceId: string
  type: string
  resourceUrl: string
  resourceDesc: string
}

export interface UserOutInfoBo {
  roleId: string
  roleName: string
  roleLevel: number
  kindergartenName?: string
  shortName?: string
  englishName?: string
  establishmentDate?: string
  kindergartenType?: string
  level?: string
  provinceName?: string
  cityName?: string
  districtName?: string
  detailedAddress?: string
  postalCode?: string
  telephone?: string
  officialWebsite?: string
  email?: string
  createTime?: string
  principal?: string
  principalPhone?: string
  status?: string
  mainPhone?: string
  tokenOneNumber?: string
  tokenTwoNumber?: string
  tokenThreeNumber?: string
  tokenFourNumber?: string
  tokenFiveNumber?: string
}

export interface UserInfo {
  userId: string
  username: string
  faceImage: string
  nickname: string
  createTime: string
  grade: string
  className: string
  status: string
  phoneNumber: string
  resources: Resource[]
  userOutInfoBo: UserOutInfoBo
}

// 用户列表项
export interface User {
  // 用户id
  userId: string
  //用户名
  username: string
  // 头像地址
  faceImage?: string
  //用户昵称
  nickname: string
  //创建时间
  createTime: string
  //年级
  grade: string
  //班级
  className: string
  //状态0正常1封禁
  status: string
}