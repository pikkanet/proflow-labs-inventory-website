import { Card } from "antd";
import React from "react";

interface DashboardCardProps {
  name: string;
  value: number;
  icon: React.ReactNode;
  iconColor: string;
  backgroundColor: string;
}

const DashboardCard = ({
  name,
  value,
  icon,
  iconColor,
  backgroundColor,
}: DashboardCardProps) => {
  return (
    <Card
      className="w-full rounded-lg shadow-xs"
      style={{ backgroundColor: backgroundColor, borderColor: backgroundColor }}
    >
      <div className="flex justify-between items-start p-2">
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-2">{name}</div>
          <div className="text-2xl font-semibold" style={{ color: iconColor }}>
            {value.toLocaleString()}
          </div>
        </div>

        <div
          className="w-12 h-12 rounded-[16px] flex items-center justify-center text-[20px] shadow-md"
          style={{
            backgroundColor: iconColor,
            color: "white",
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default DashboardCard;
