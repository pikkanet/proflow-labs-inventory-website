"use client";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { AuthProvider } from "./contexts/AuthContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AntdRegistry>
      <StyleProvider layer>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#326A8C",  
              
            },
          }}
        >
          <AuthProvider>{children}</AuthProvider>
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
};
