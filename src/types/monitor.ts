// 当日调用情况
export interface DayStatus {
  /**
   * 失败数
   */
  fail: number;
  /**
   * 正在生成数
   */
  progress: number;
  /**
   * 成功数
   */
  success: number;
  /**
   * 总数
   */
  total: number;
  /**
   * 类型
   */
  type: string;
}

// 3D实时调用记录
export interface SemaphoreStatus {
  /**
   * 剩余使用量
   */
  availablePermits: number;
  /**
   * 当前使用量
   */
  currentConcurrent: number;
  /**
   * 容量
   */
  maxConcurrent: number;
  taskList: TaskList[];
}

export interface TaskList {
  /**
   * 耗时
   */
  elapsedTime?: number;
  /**
   * 幼儿园id
   */
  kindergartenId?: null;
  /**
   * 幼儿园名称
   */
  kindergartenName?: null;
  /**
   * 开始时间
   */
  startTime?: string;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 用户名称
   */
  username?: string;
}

// 模型调用记录统计
export interface CallTrend {
  /**
   * 成功数
   */
  successCalls: number;
  /**
   * 成功率
   */
  successRate: string;
  /**
   * 时间点
   */
  timePoint: string;
  /**
   * 类型
   */
  timeType: string;
  /**
   * 总数
   */
  totalCalls: number;
}

// 日志记录
export interface LogItem {
  /**
   * 浏览器
   */
  browser: string;
  /**
   * 类名方法名
   */
  classMethod: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 错误信息
   */
  errorMsg: null;
  /**
   * 地址
   */
  location: null;
  /**
   * 请求方法
   */
  method: string;
  /**
   * 用户名称
   */
  nickName: string;
  /**
   * 操作系统
   */
  os: string;
  /**
   * 路径
   */
  path: string;
  /**
   * 日志id
   */
  requestId: string;
  /**
   * 请求ip
   */
  requestIp: string;
  /**
   * 请求参数
   */
  requestParams: string;
  /**
   * 请求时间
   */
  requestTime: string;
  /**
   * 请求url
   */
  requestUrl: string;
  /**
   * 响应编码
   */
  responseCode: string;
  /**
   * 响应消息
   */
  responseMsg: string;
  /**
   * 响应参数
   */
  responseParams: string;
  /**
   * 是否成功
   */
  success: number;
  /**
   * 耗时
   */
  timeCost: number;
  /**
   * 类型编码
   */
  type: string;
  /**
   * 类型名称自定义
   */
  typeName: string;
  /**
   * 用户id
   */
  userId: string;
}
