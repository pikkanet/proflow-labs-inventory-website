"use client";

import { Layout, Menu, Avatar, Breadcrumb } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import {
  PieChartOutlined,
  ShopOutlined,
  LeftOutlined,
  LogoutOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";

const { Sider, Header, Content } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  disabled?: boolean;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <PieChartOutlined />,
    path: "/dashboard",
    disabled: true,
  },
  {
    key: "inventory-management",
    label: "Inventory Management",
    icon: <ShopOutlined />,
    children: [
      {
        key: "warehouse",
        label: "Warehouse",
        icon: <DatabaseOutlined />,
        path: "/warehouse",
        disabled: true,
      },
      {
        key: "inventory",
        label: "Inventory",
        icon: <ShopOutlined />,
        path: "/inventory",
      },
    ],
  },
];

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const email = user?.email || "";

  // Hide layout on login page
  const isLoginPage = pathname === "/login";

  const allMenuItems = useMemo(() => {
    return menuItems.flatMap((item) =>
      item.children ? [item, ...item.children] : [item]
    );
  }, []);

  const currentItem = useMemo(() => {
    return (
      allMenuItems.find((item) => item.path === pathname) || allMenuItems[0]
    );
  }, [pathname, allMenuItems]);

  const selectedKey = currentItem.key;
  const pageTitle = currentItem.label;

  const breadcrumbItems: BreadcrumbItemType[] = [
    {
      title: pageTitle === "Dashboard" ? "Dashboard" : "Inventory Management",
      onClick: () => setCollapsed(false),
    },
    ...(pageTitle !== "Dashboard"
      ? [
          {
            title: pageTitle,
            onClick: () => setCollapsed(false),
          },
        ]
      : []),
  ];

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      const item = allMenuItems.find((menuItem) => menuItem.key === key);
      if (item && !item.disabled && item.path) {
        router.push(item.path);
      }
    },
    [allMenuItems, router]
  );

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const getAvatar = useCallback((email: string) => {
    return email.charAt(0).toUpperCase();
  }, []);

  // If on login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <Layout className="min-h-screen">
      <Sider
        width={280}
        collapsed={collapsed}
        collapsible
        trigger={null}
        className="overflow-auto h-screen fixed left-0 top-0 bottom-0 bg-white flex flex-col justify-between border-r border-gray-200"
      >
        <div className="flex flex-col h-full justify-between">
          <div className="px-4 py-4">
            {/* Header Logo and collapse button */}
            <div className="flex items-center justify-between mb-4 ">
              <div className="flex items-center gap-3">
                <Image
                  src="https://dummyimage.com/600x600/326A8C/fff&text=Proflow"
                  alt="Proflow Logo"
                  className="rounded-md"
                  width={32}
                  height={32}
                />
                {!collapsed && (
                  <p className="text-lg font-semibold text-[#326A8C]">
                    Proflow
                  </p>
                )}
              </div>

              <div className="ml-2 -mr-2">
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="cursor-pointer"
                >
                  <LeftOutlined
                    className={`text-[#326A8C] transition-transform duration-300 ${
                      collapsed ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Main Menu */}
            <div className="flex-1 overflow-auto">
              <Menu
                theme="light"
                selectedKeys={[selectedKey]}
                defaultOpenKeys={["inventory-management"]}
                mode="inline"
                items={menuItems.map((item) => ({
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                  disabled: item.disabled,
                  children: item.children?.map((child) => ({
                    key: child.key,
                    icon: child.icon,
                    label: child.label,
                    disabled: child.disabled,
                  })),
                }))}
                onClick={handleMenuClick}
              />
            </div>
          </div>

          {/* Bottom User Info */}
          <div className="px-4 py-4 text-gray-700">
            <div className="flex items-center gap-2">
              <Avatar size={32} onClick={() => setCollapsed(false)}>
                <span className="text-sm ">{getAvatar(email)}</span>
              </Avatar>
              {!collapsed && (
                <>
                  <span className="text-sm flex-1">{email}</span>
                  <LogoutOutlined
                    className="text-gray-600 cursor-pointer"
                    onClick={handleLogout}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Sider>

      {/* Main Layout */}
      <Layout
        className={`transition-[margin-left] duration-200 ${
          collapsed ? "ml-20" : "ml-[280px]"
        }`}
      >
        <Header className="px-6 bg-white flex items-center gap-4 border-b border-[#f0f0f0] h-16">
          <Breadcrumb className="cursor-pointer" items={breadcrumbItems} />
        </Header>

        {/* breadcrumb 64, padding 32 */}
        <Content className="m-4 bg-white min-h-[calc(100vh-64px-32px)] h-[calc(100vh-64px-32px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
