"use client";

import { Layout, Menu, Breadcrumb } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
  MenuOutlined,
  PieChartOutlined,
  ShopOutlined,
  LeftOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  disabled?: boolean;
}

const menuItems: MenuItem[] = [
  {
    key: "inventory",
    label: "Inventory",
    icon: <MenuOutlined />,
    path: "/inventory",
    disabled: true,
  },
  {
    key: "warehouse",
    label: "Warehouse",
    icon: <PieChartOutlined />,
    path: "/warehouse",
    disabled: true,
  },
  {
    key: "inventory-list",
    label: "Inventory",
    icon: <ShopOutlined />,
    path: "/inventory",
  },
];

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentItem = useMemo(() => {
    return menuItems.find((item) => item.path === pathname) || menuItems[0];
  }, [pathname]);

  const selectedKey = currentItem.key;
  const pageTitle = currentItem.label;

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find((menuItem) => menuItem.key === key);
    if (item && !item.disabled) {
      router.push(item.path);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        className="overflow-auto h-screen fixed left-0 top-0 bottom-0 bg-white"
        theme="light"
      >
        <Menu
          theme="light"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            disabled: item.disabled,
          }))}
          onClick={handleMenuClick}
        />
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setCollapsed(!collapsed);
            }
          }}
          className="absolute bottom-4 left-4 cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <LeftOutlined
            className={`transition-transform duration-300 ${
              collapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </Sider>
      <Layout
        className={`transition-[margin-left] duration-200 ${
          collapsed ? "ml-20" : "ml-[250px]"
        }`}
      >
        <Header className="px-6 bg-white flex items-center gap-4 border-b border-[#f0f0f0] h-16">
          <Breadcrumb
            items={[
              {
                title: "Inventory",
              },
              {
                title: pageTitle,
              },
            ]}
          />
        </Header>
        {/* Comments magic number */}
        <Content className="m-6 bg-white min-h-[calc(100vh-64px-24px-24px)] h-[calc(100vh-64px-24px-24px)]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
