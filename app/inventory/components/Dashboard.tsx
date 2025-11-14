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
import { useRefresh } from "@/app/contexts/RefreshContext";

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
  const { refreshKey } = useRefresh();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
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
  }, [refreshKey]);

  if (loading || error) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="w-full rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Skeleton.Input active size="small" className="w-25 mb-3" />
                <Skeleton.Input active size="large" className="w-20 h-8" />
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
    <>
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
      <div className="flex justify-end pt-2 -mb-1">
        <p className="text-sm text-gray-500">
          <span className="font-bold">Last updated:</span>{" "}
          {new Date().toLocaleString()}
        </p>
      </div>
    </>
  );
};

export default Dashboard;
