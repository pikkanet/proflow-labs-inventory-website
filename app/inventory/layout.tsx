"use client";

import { Divider, Layout } from "antd";
import Search from "./components/Search";
import Dashboard from "./components/Dashboard";

const { Header, Content, Footer } = Layout;

const InventoryLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Layout className="h-full flex flex-col bg-white">
      <Header className="bg-white border-b border-[#f0f0f0] px-6 h-auto flex flex-col py-4">
        <Search />
        <Divider className="-my-4" />
        <Dashboard />
      </Header>

      <Content className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
        {children}
      </Content>

      <Footer className="border-t border-[#f0f0f0] px-6 h-8 flex items-center justify-center flex-shrink-0">
        <p className="text-sm text-gray-500 m-0">Pagination</p>
      </Footer>
    </Layout>
  );
};

export default InventoryLayout;
