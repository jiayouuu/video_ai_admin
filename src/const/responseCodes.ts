/*
 * @Author: 桂佳囿
 * @Date: 2025-11-30 17:25:53
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:39:24
 * @Description: 响应代码枚举
 */
export const ResponseCode = {
  // ==================== 通用 ====================
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,

  // ==================== 用户相关 6000-6099 ====================
  USER_NOT_EXIST: 6001,
  USER_PASSWORD_ERROR: 6002,
  USER_DISABLED: 6003,
  USER_EXIST: 6004,
  LOGIN_REQUIRED: 6005,
  TOKEN_INVALID: 6006,
  PERMISSION_DENIED: 6007,

  // =================== 验证码相关 6010-6020 ====================
  PHONE_FORMAT_INVALID: 6010,
  CAPTCHA_VERIFICATION_REQUIRED: 6011,
  SMS_SENDING_FAILED: 6012,
  PHONE_DAILY_LIMIT_EXCEEDED: 6013,
  SYSTEM_DAILY_LIMIT_EXCEEDED: 6014,
  SMS_CODE_INVALID: 6015,
  SMS_CODE_EXPIRED: 6016,

  // ==================== 参数校验 6100-6199 ====================
  PARAM_ILLEGAL: 6101,
  PARAM_EMPTY: 6102,
  PARAM_FORMAT_ERROR: 6103,
  FILE_TOO_LARGE: 6104,

  // ==================== 数据操作 6200-6299 ====================
  DATA_NOT_FOUND: 6201,
  DATA_EXIST: 6202,
  DATA_UPDATE_FAILED: 6203,
  DATA_DELETE_FAILED: 6204,
  DATA_ADD_FAILED: 6205,

  // ==================== 文件操作 6300-6399 ====================
  FILE_UPLOAD_FAILED: 6301,
  FILE_DOWNLOAD_FAILED: 6302,
  FILE_TYPE_NOT_SUPPORT: 6303,

  // ==================== 系统级别 6500-6599 ====================
  SYSTEM_ERROR: 6501,
  DATABASE_ERROR: 6502,
  NETWORK_ERROR: 6503,
  THIRD_PARTY_SERVICE_ERROR: 6504,

  // ==================== 业务逻辑 6600-6699 ====================
  OPERATION_TOO_FREQUENT: 6601,
  INSUFFICIENT_BALANCE: 6602,
  OPERATION_NOT_ALLOWED: 6603,
} as const;

export type ResponseCode = (typeof ResponseCode)[keyof typeof ResponseCode];
