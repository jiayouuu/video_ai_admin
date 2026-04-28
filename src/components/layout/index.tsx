/*
 * @Author: 桂佳囿
 * @Date: 2025-12-24 13:33:27
 * @LastEditors: 桂佳囿
 * @LastEditTime: 2026-04-28 15:23:11
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
  SettingOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores/user";
import { useTokenStore } from "@/stores/token";
import { useAppTheme } from "@/contexts/themeContext";
import styles from "@/components/layout/index.module.scss";

const { Header, Sider, Content } = Layout;

interface LayoutBodyProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const LayoutBody: FC<LayoutBodyProps> = ({ collapsed, onToggleCollapsed }) => {
  const { currentTheme, themeMode, setThemeMode } = useAppTheme();
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
    selectedKeys: [`theme:${themeMode}`],
    items: [
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "退出登录",
        onClick: handleLogout,
      },
      {
        key: "systemTheme",
        icon: <SettingOutlined />,
        label: "系统主题",
        children: [
          {
            key: "theme:system",
            label: "跟随系统",
            onClick: () => setThemeMode("system"),
          },
          {
            key: "theme:light",
            label: "浅色模式",
            onClick: () => setThemeMode("light"),
          },
          {
            key: "theme:dark",
            label: "深色模式",
            onClick: () => setThemeMode("dark"),
          },
        ],
      },
    ],
  };

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={currentTheme}
        width={236}
        collapsedWidth={84}
        style={{
          background: "var(--app-bg-panel)",
          borderRight: "1px solid var(--app-border-soft)",
        }}
      >
        <div
          className={`${styles.logo} mx-3 mb-2 mt-3.5 flex h-11 items-center justify-center overflow-hidden whitespace-nowrap rounded-[10px] border border-(--app-border-soft) font-bold tracking-[0.2px] text-(--app-brand-primary)`}
          data-theme={currentTheme}
        >
          {collapsed ? "童影" : "童影AI后台管理"}
        </div>
        <Menu
          className={styles.menu}
          data-theme={currentTheme}
          theme={currentTheme}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: "transparent",
            borderRight: "none",
            paddingInline: 8,
          }}
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
            onClick={onToggleCollapsed}
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

const AppLayout: FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutBody
      collapsed={collapsed}
      onToggleCollapsed={() => setCollapsed((v) => !v)}
    />
  );
};

export default AppLayout;
