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
import {
  login as loginService,
  getCaptcha,
  verifyCaptcha,
  getSmsCode,
} from "@/services/auth";
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
  const setRefreshToken = useTokenStore((s) => s.setRefreshToken);
  const setUser = useUserStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("password");
  const [countdown, setCountdown] = useState(0);
  const [imageCaptchaUrl, setImageCaptchaUrl] = useState<string>("");
  const [captchaKey, setCaptchaKey] = useState<string>("");
  const [passwordForm] = Form.useForm();
  const [smsForm] = Form.useForm();
  const captchaTimer = useRef<NodeJS.Timeout | null>(null);
  const smsTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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
      if (smsTimer.current) {
        clearInterval(smsTimer.current);
      }
    };
  }, []);

  // 发送短信验证码
  const sendSmsCode = async () => {
    try {
      const phone = smsForm.getFieldValue("phone");
      const imageCaptcha = smsForm.getFieldValue("imageCaptcha");

      if (!phone) {
        message.error("请输入手机号！");
        return;
      }
      if (!imageCaptcha) {
        message.error("请输入图形验证码！");
        return;
      }

      // 校验图形验证码
      const verifyRes = await verifyCaptcha({
        captchaKey,
        captcha: imageCaptcha,
      });
      if (!verifyRes.valid) {
        message.error(verifyRes.message || "图形验证码错误！");
        refreshImageCaptcha();
        smsForm.setFieldValue("imageCaptcha", "");
        return;
      }
      message.loading({
        content: "发送中，请稍候...",
        duration: 0,
        key: "smsSend",
      });
      // 发送短信验证码
      const smsRes = await getSmsCode({
        phoneNumber: phone,
        captcha: imageCaptcha,
        captchaKey,
      });
      message.success(smsRes.message || "短信验证码已发送，请注意查收！");
      // 开始倒计时
      let time = smsRes.expireSeconds || 60;
      setCountdown(time);
      if (smsTimer.current) clearInterval(smsTimer.current);
      smsTimer.current = setInterval(() => {
        time--;
        setCountdown(time);
        if (time === 0) {
          if (smsTimer.current) clearInterval(smsTimer.current);
        }
      }, 1000);
    } catch (error) {
      console.error("发送短信验证码失败", error);
      refreshImageCaptcha();
      smsForm.setFieldValue("imageCaptcha", "");
    } finally {
      message.destroy("smsSend");
    }
  };

  // 密码登录
  const onPasswordLogin = async (values: PasswordLoginForm) => {
    try {
      setLoading(true);
      const { phone, password, imageCaptcha } = values;

      const res = await loginService({
        loginType: "pw",
        username: encryptAES(phone),
        password: encryptAES(password),
        captcha: imageCaptcha,
        captchaKey: captchaKey,
      });

      if (res) {
        setToken(res.token);
        setRefreshToken(res.refreshToken);
        setUser(res.userInfo);
        message.success("登录成功！");
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error(error);
      // 登录失败刷新验证码
      refreshImageCaptcha();
      passwordForm.setFieldValue("imageCaptcha", "");
    } finally {
      setLoading(false);
    }
  };

  // 短信验证码登录
  const onSmsLogin = async (values: SmsLoginForm) => {
    try {
      setLoading(true);
      const { phone, smsCaptcha } = values;
      console.log("sms login", phone, smsCaptcha);
      const res = await loginService({
        loginType: "sms",
        phoneNumber: encryptAES(phone),
        smsCode: encryptAES(smsCaptcha),
      });
      if (res) {
        setToken(res.token);
        setRefreshToken(res.refreshToken);
        setUser(res.userInfo);
        message.success("登录成功！");
        navigate("/", { replace: true });
      }
    } catch {
      message.error("登录失败，请重试！");
    } finally {
      setLoading(false);
    }
  };

  // 切换登录方式时刷新图形验证码
  const handleTabChange = (key: string) => {
    // 重置倒计时
    setCountdown(0);
    if (smsTimer.current) {
      clearInterval(smsTimer.current);
      smsTimer.current = null;
    }
    setActiveTab(key);
    passwordForm.resetFields();
    smsForm.resetFields();
    refreshImageCaptcha();
  };

  const tabItems = [
    {
      key: "password",
      label: "密码登录",
      children: (
        <Form
          form={passwordForm}
          name="passwordLogin"
          onFinish={onPasswordLogin}
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
          form={smsForm}
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
        <h2>欢迎登录</h2>
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
