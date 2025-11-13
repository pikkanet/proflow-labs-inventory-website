"use client";

import { Card, Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import Image from "next/image";
import { AxiosError } from "axios";

const LoginPage = () => {
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
    } catch (error: unknown | AxiosError) {
      let errorMessage = "Please retry again later";
      if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: errorMessage,
        confirmButtonColor: "#326A8C",
      });
    } finally {
      setLoading(false);
    }
  };

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
          {/* TODO: Change to Username instead of Email */}
          <Form.Item
            name="email"
            label="Email"
            className="mb-4"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Enter Email"
              autoComplete="email"
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
