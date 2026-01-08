/*
 * @Author: 桂佳囿
 * @Date: 2025-12-24 13:33:27
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-01-08 09:18:37
 * @Description: 应用布局组件
 */
import { useMemo, useState, type FC } from "react";
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SignatureOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores/user";
import { useTokenStore } from "@/stores/token";

const { Header, Sider, Content } = Layout;

const AppLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearUser } = useUserStore();
  const { clearToken } = useTokenStore();
  // 头像地址
  const avatarSrc = useMemo(() => {
    return `${import.meta.env.VITE_API_HOST}${user.faceImage}`;
  }, [user.faceImage]);
  // 退出登录
  const handleLogout = () => {
    clearToken();
    clearUser();
    navigate("/auth/login", { replace: true });
  };

  const menuItems = [
    {
      key: "/user",
      icon: <UserOutlined />,
      label: "用户管理",
    },
    {
      key: "/kindergarten",
      icon: <BankOutlined />,
      label: "幼儿园管理",
    },
    {
      key: "/dictionary",
      icon: <SignatureOutlined />,
      label: "字典管理",
    },
  ];

  const userMenu = {
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="demo-logo-vertical"
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {collapsed ? "AI" : "视频生成AI后台管理"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={userMenu}>
            <Space style={{ cursor: "pointer" }}>
              <Avatar icon={<UserOutlined />} src={avatarSrc} />
              <span>{user?.nickname}</span>
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
