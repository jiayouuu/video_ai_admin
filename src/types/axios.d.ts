/*
 * @Author: 桂佳囿
 * @Date: 2025-12-19 17:10:10
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:42:30
 * @Description: Axios 类型扩展
 */

import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** 手动指定取消请求的 key */
    cancelKey?: string;
    /** 实际生成的 request key */
    __requestKey?: string;
  }
}
