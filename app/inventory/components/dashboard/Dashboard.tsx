"use client";

import { Skeleton, Card } from "antd";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  WarningOutlined,
  FallOutlined,
} from "@ant-design/icons";
import DashboardCard from "./DashboardCard";
import { format } from "date-fns";
import useDashboard from "./hooks/useDashboard";

const Dashboard = () => {
  const { data, loading, error } = useDashboard();

  if (loading || error) {
    return (
      <>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <Card key={item} className="w-full rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1 flex flex-col">
                  <Skeleton.Input active size="small" className="w-25 mb-3" />
                  <Skeleton.Input active size="large" className="w-20 h-8" />
                </div>
                <Skeleton.Avatar active size={48} shape="circle" />
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <Skeleton.Input active size="small" className="h-4 w-48" />
        </div>
      </>
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
          {format(new Date(data.lastUpdated), "MMM d, yyyy h:mm a")}
        </p>
      </div>
    </>
  );
};

export default Dashboard;
