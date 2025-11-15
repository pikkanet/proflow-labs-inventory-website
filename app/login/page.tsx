"use client";

import { Card, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Image from "next/image";
import useLogin from "./hooks/useLogin";

const LoginPage = () => {
  const [form] = Form.useForm();
  const { loading, onFinish } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg p-10">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="https://dummyimage.com/600x600/326A8C/fff&text=Proflow"
            alt="Proflow Logo"
            className="rounded-md mb-4"
            width={80}
            height={80}
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome to Proflow
          </h2>
          <h1 className="text-3xl font-bold text-[#326A8C]">Login</h1>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="username"
            label="Username"
            className="mb-4"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            className="mb-4"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item className="mt-6 mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="text-base font-semibold"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
