/*
 * @Author: 桂佳囿
 * @Date: 2025-11-30 17:26:20
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:40:34
 * @Description: 响应消息枚举
 */
import { ResponseCode } from "@/const/responseCodes";

export const ResponseMsg: Record<ResponseCode, string> = {
  // ==================== 通用 ====================
  [ResponseCode.SUCCESS]: "操作成功",
  [ResponseCode.BAD_REQUEST]: "请求参数错误",
  [ResponseCode.UNAUTHORIZED]: "未授权访问",
  [ResponseCode.FORBIDDEN]: "访问被禁止",
  [ResponseCode.NOT_FOUND]: "资源不存在",
  [ResponseCode.METHOD_NOT_ALLOWED]: "请求方法不允许",
  [ResponseCode.INTERNAL_SERVER_ERROR]: "服务器内部错误",
  [ResponseCode.SERVICE_UNAVAILABLE]: "服务暂不可用",

  // ==================== 用户相关 6000-6099 ====================
  [ResponseCode.USER_NOT_EXIST]: "用户不存在",
  [ResponseCode.USER_PASSWORD_ERROR]: "用户名或密码错误",
  [ResponseCode.USER_DISABLED]: "用户已被禁用",
  [ResponseCode.USER_EXIST]: "用户已存在",
  [ResponseCode.LOGIN_REQUIRED]: "请先登录",
  [ResponseCode.TOKEN_INVALID]: "令牌无效或已过期",
  [ResponseCode.PERMISSION_DENIED]: "权限不足",
  // =================== 验证码相关 6010-6020 ====================
  [ResponseCode.PHONE_FORMAT_INVALID]: "手机号格式不正确",
  [ResponseCode.CAPTCHA_VERIFICATION_REQUIRED]: "请先通过图形验证码验证",
  [ResponseCode.SMS_SENDING_FAILED]: "短信发送失败",
  [ResponseCode.PHONE_DAILY_LIMIT_EXCEEDED]: "手机号当日发送次数超限",
  [ResponseCode.SYSTEM_DAILY_LIMIT_EXCEEDED]: "系统当日发送次数超限",
  [ResponseCode.SMS_CODE_INVALID]: "短信验证码错误",
  [ResponseCode.SMS_CODE_EXPIRED]: "短信验证码已过期",

  // ==================== 参数校验 6100-6199 ====================
  [ResponseCode.PARAM_ILLEGAL]: "参数不合法",
  [ResponseCode.PARAM_EMPTY]: "参数不能为空",
  [ResponseCode.PARAM_FORMAT_ERROR]: "参数格式错误",
  [ResponseCode.FILE_TOO_LARGE]: "文件大小超出限制",

  // ==================== 数据操作 6200-6299 ====================
  [ResponseCode.DATA_NOT_FOUND]: "数据不存在",
  [ResponseCode.DATA_EXIST]: "数据已存在",
  [ResponseCode.DATA_UPDATE_FAILED]: "数据更新失败",
  [ResponseCode.DATA_DELETE_FAILED]: "数据删除失败",
  [ResponseCode.DATA_ADD_FAILED]: "数据添加失败",

  // ==================== 文件操作 6300-6399 ====================
  [ResponseCode.FILE_UPLOAD_FAILED]: "文件上传失败",
  [ResponseCode.FILE_DOWNLOAD_FAILED]: "文件下载失败",
  [ResponseCode.FILE_TYPE_NOT_SUPPORT]: "文件类型不支持",

  // ==================== 系统级别 6500-6599 ====================
  [ResponseCode.SYSTEM_ERROR]: "系统错误",
  [ResponseCode.DATABASE_ERROR]: "数据库操作错误",
  [ResponseCode.NETWORK_ERROR]: "网络连接错误",
  [ResponseCode.THIRD_PARTY_SERVICE_ERROR]: "第三方服务异常",

  // ==================== 业务逻辑 6600-6699 ====================
  [ResponseCode.OPERATION_TOO_FREQUENT]: "操作过于频繁",
  [ResponseCode.INSUFFICIENT_BALANCE]: "余额不足",
  [ResponseCode.OPERATION_NOT_ALLOWED]: "当前状态不允许此操作",
};
