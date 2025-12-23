import { useState, type FC } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import style from "../auth.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(style);

interface LoginForm {
  username: string;
  password: string;
}

const Login: FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      // TODO: 实现登录逻辑
      console.log("登录信息:", values);
      message.success("登录成功！");
    } catch {
      message.error("登录失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cx("authContainer")}>
      <div className={cx("authForm")}>
        <h2>登录</h2>
        <Form name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
