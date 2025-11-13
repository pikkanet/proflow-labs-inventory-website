"use client";

import { useEffect, useState } from "react";
import { Skeleton, Card } from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  WarningOutlined,
  FallOutlined,
} from "@ant-design/icons";
import DashboardCard from "./DashboardCard";
import axiosInstance from "@/app/services/axiosInstance";
import Swal from "sweetalert2";

interface DashboardData {
  totalItems: number;
  totalQuantity: number;
  lowStock: number;
  outOfStock: number;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/dashboard");
        const { data, status } = response;

        if (status !== 200) {
          throw new Error(data.message);
        }

        const result = data.data;
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        await Swal.fire({
          icon: "error",
          title: "Something went wrong!",
          text: "Please retry again later",
          confirmButtonColor: "#326A8C",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || error) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="w-full rounded-lg">
            <div className="flex justify-between items-start">
              <div style={{ flex: 1 }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 100, marginBottom: 12 }}
                />
                <Skeleton.Input
                  active
                  size="large"
                  style={{ width: 80, height: 32 }}
                />
              </div>
              <Skeleton.Avatar active size={48} shape="circle" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return <div>Data is not available</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <DashboardCard
        name="Total Items"
        value={data.totalItems}
        icon={<ShoppingCartOutlined />}
        iconColor="#356FE6"
        backgroundColor="#F1F8FF"
      />
      <DashboardCard
        name="Total Quantity"
        value={data.totalQuantity}
        icon={<HomeOutlined />}
        iconColor="#42925B"
        backgroundColor="#EFFDF4"
      />
      <DashboardCard
        name="Low Stock"
        value={data.lowStock}
        icon={<WarningOutlined />}
        iconColor="#CD6F2A"
        backgroundColor="#FEFAEC"
      />
      <DashboardCard
        name="Out of Stock"
        value={data.outOfStock}
        icon={<FallOutlined />}
        iconColor="#C73E2E"
        backgroundColor="#FCF4F3"
      />
    </div>
  );
};

export default Dashboard;
