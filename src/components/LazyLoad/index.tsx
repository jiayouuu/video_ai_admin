/*
 * @Author: 桂佳囿
 * @Date: 2025-07-12 14:48:33
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2025-12-22 09:39:17
 * @Description: 懒加载组件
 */
import { lazy, Suspense, type JSX } from "react";
import { Spin } from "antd";
import style from "./index.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(style);
export function lazyLoad(
  loader: () => Promise<{ default: React.ComponentType }>
): JSX.Element {
  const Component = lazy(loader);
  return (
    <Suspense
      fallback={
        <div className={cx("loading")}>
          <Spin size="large" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
