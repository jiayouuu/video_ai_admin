import { useState, type FC, useEffect, useRef } from "react";
import { Form, Input, Button, Tabs } from "antd";
import { message } from "@/bridges/messageBridge";
import { useNavigate } from "react-router-dom";
import {
  LockOutlined,
  MobileOutlined,
  SafetyCertificateOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { login as loginService, getCaptcha } from "@/services/auth";
import { encryptAES } from "@/utils/crypto";
import { useTokenStore } from "@/stores/token";
import { useUserStore } from "@/stores/user";
import style from "./index.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(style);

interface PasswordLoginForm {
  phone: string;
  password: string;
  imageCaptcha: string;
}

interface SmsLoginForm {
  phone: string;
  imageCaptcha: string;
  smsCaptcha: string;
}

const Login: FC = () => {
  const navigate = useNavigate();
  const setToken = useTokenStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("password");
  const [countdown, setCountdown] = useState(0);
  const [imageCaptchaUrl, setImageCaptchaUrl] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [form] = Form.useForm();
  const captchaTimer = useRef<NodeJS.Timeout | null>(null);

  // 刷新图形验证码
  const refreshImageCaptcha = async () => {
    if (captchaTimer.current) {
      clearTimeout(captchaTimer.current);
      captchaTimer.current = null;
    }
    try {
      const res = await getCaptcha();
      if (res) {
        setCaptchaKey(res.captchaKey);
        setImageCaptchaUrl(res.captchaImage);
        // 自动刷新倒计时
        const expireTime = parseInt(res.expireSeconds);
        if (!isNaN(expireTime) && expireTime > 0) {
          captchaTimer.current = setTimeout(() => {
            // message.warning("验证码已过期，已自动刷新");
            console.warn("验证码已过期，已自动刷新");
            refreshImageCaptcha();
          }, expireTime * 1000);
        }
      }
    } catch (error) {
      console.error("获取验证码失败", error);
    }
  };

  useEffect(() => {
    refreshImageCaptcha();
    return () => {
      if (captchaTimer.current) {
        clearTimeout(captchaTimer.current);
      }
    };
  }, []);

  // 发送短信验证码
  const sendSmsCode = async () => {
    try {
      const phone = form.getFieldValue("phone");
      const imageCaptcha = form.getFieldValue("imageCaptcha");

      if (!phone) {
        message.error("请输入手机号！");
        return;
      }
      if (!imageCaptcha) {
        message.error("请输入图形验证码！");
        return;
      }

      // TODO: 调用API发送短信验证码
      console.log("发送短信验证码:", { phone, imageCaptcha });
      message.success("验证码已发送！");

      // 开始倒计时
      let time = 60;
      setCountdown(time);
      const timer = setInterval(() => {
        time--;
        setCountdown(time);
        if (time === 0) {
          clearInterval(timer);
        }
      }, 1000);
    } catch (error) {
      message.error("发送验证码失败，请重试！");
    }
  };

  // 密码登录
  const onPasswordLogin = async (values: PasswordLoginForm) => {
    try {
      setLoading(true);
      const { phone, password, imageCaptcha } = values;

      // 加密
      const encryptedPhone = encryptAES(phone);
      const encryptedPassword = encryptAES(password);

      const res = await loginService({
        loginType: "pw",
        username: encryptedPhone,
        password: encryptedPassword,
        captcha: imageCaptcha,
        captchaKey: captchaKey,
      });

      if (res) {
        setToken(res.token);
        setUser(res.userInfo);
        message.success("登录成功！");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      // 登录失败刷新验证码
      refreshImageCaptcha();
      form.setFieldValue("imageCaptcha", "");
    } finally {
      setLoading(false);
    }
  };

  // 短信验证码登录
  const onSmsLogin = async (values: SmsLoginForm) => {
    try {
      setLoading(true);
      // TODO: 实现短信验证码登录逻辑
      console.log("短信登录信息:", values);
      message.success("登录成功！");
    } catch {
      message.error("登录失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  // 切换登录方式时刷新图形验证码
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    form.resetFields();
    refreshImageCaptcha();
  };

  const tabItems = [
    {
      key: "password",
      label: "密码登录",
      children: (
        <Form
          form={form}
          name="passwordLogin"
          onFinish={onPasswordLogin}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号！" },
              // { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确！" },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
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
          <div style={{ display: "flex", gap: "8px" }}>
            <Form.Item
              name="imageCaptcha"
              rules={[{ required: true, message: "请输入验证码！" }]}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="图形验证码"
                size="large"
              />
            </Form.Item>
            <div
              style={{
                width: "120px",
                height: "40px",
                cursor: "pointer",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                overflow: "hidden",
              }}
              onClick={refreshImageCaptcha}
            >
              {imageCaptchaUrl ? (
                <img
                  src={imageCaptchaUrl}
                  alt="验证码"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span style={{ fontSize: "12px", color: "#999" }}>
                  点击刷新
                </span>
              )}
            </div>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "sms",
      label: "短信登录",
      children: (
        <Form
          form={form}
          name="smsLogin"
          onFinish={onSmsLogin}
          autoComplete="off"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "请输入手机号！" },
              { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确！" },
            ]}
          >
            <Input
              prefix={<MobileOutlined />}
              placeholder="手机号"
              size="large"
            />
          </Form.Item>

          <div style={{ display: "flex", gap: "8px" }}>
            <Form.Item
              name="imageCaptcha"
              rules={[{ required: true, message: "请输入验证码！" }]}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="图形验证码"
                size="large"
              />
            </Form.Item>
            <div
              style={{
                width: "120px",
                height: "40px",
                cursor: "pointer",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                overflow: "hidden",
              }}
              onClick={refreshImageCaptcha}
            >
              {imageCaptchaUrl ? (
                <img
                  src={imageCaptchaUrl}
                  alt="验证码"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <span style={{ fontSize: "12px", color: "#999" }}>
                  点击刷新
                </span>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Form.Item
              name="smsCaptcha"
              rules={[{ required: true, message: "请输入短信验证码！" }]}
            >
              <Input
                prefix={<MessageOutlined />}
                placeholder="短信验证码"
                size="large"
              />
            </Form.Item>
            <Button
              size="large"
              style={{ width: "120px" }}
              onClick={sendSmsCode}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `${countdown}秒后重试` : "获取验证码"}
            </Button>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className={cx("authContainer")}>
      <div className={cx("authForm")}>
        <h2>登录</h2>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
        />
      </div>
    </div>
  );
};

export default Login;
