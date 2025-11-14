"use client";

import { Layout } from "antd";
import Dashboard from "./components/Dashboard";
import { RefreshProvider } from "@/app/contexts/RefreshContext";

const { Header, Content } = Layout;

const InventoryLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Layout className="h-full flex flex-col">
      <RefreshProvider>
        <Header className="flex flex-col h-auto bg-white px-6 py-4 mb-2 rounded-md shadow-xs">
          <Dashboard />
        </Header>

        <Content className="flex flex-col flex-1 px-4 py-4 min-h-0 overflow-hidden overflow-x-hidden mt-2 bg-white rounded-md shadow-xs">
          {children}
        </Content>
      </RefreshProvider>
    </Layout>
  );
};

export default InventoryLayout;
