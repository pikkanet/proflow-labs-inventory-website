"use client";

import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { useState } from "react";
import { ActivityType } from "../../enums/activityType";

interface Movement {
  activity_type: ActivityType;
  qty: number;
  current_qty: number;
  created_at: string;
  note: string | null;
}

interface ItemMovementChartProps {
  movements: Movement[];
}

interface ChartDataPoint {
  date: string;
  qty: number;
  fullDate: string;
  index: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ChartDataPoint;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-md shadow-md">
        <p className="m-0 font-semibold">
          QTY: {payload[0].value} ({payload[0].payload.fullDate})
        </p>
      </div>
    );
  }
  return null;
};

const ItemMovementChart = ({ movements }: ItemMovementChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filteredMovements = movements.slice(0, 7).reverse();

  const chartData: ChartDataPoint[] = filteredMovements.map(
    (movement, index) => {
      let currentQty = movement.current_qty;
      if (movement.activity_type === ActivityType.OUTBOUND) {
        currentQty -= movement.qty;
      } else {
        currentQty += movement.qty;
      }
      return {
        date: format(new Date(movement?.created_at), "MMM d"),
        qty: currentQty,
        fullDate: format(new Date(movement?.created_at), "MMM d, yyyy h:mm a"),
        index: index,
      };
    }
  );

  const maxQty = Math.max(...chartData.map((d) => d.qty), 0);
  const yAxisDomain = [0, maxQty || 1];

  const handleMouseMove = (
    state: { activeTooltipIndex?: number | string } | null
  ) => {
    if (state?.activeTooltipIndex !== undefined) {
      const index =
        typeof state.activeTooltipIndex === "number"
          ? state.activeTooltipIndex
          : null;
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseMove={handleMouseMove as never}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="index" tick={false} stroke="#666" />
          <YAxis domain={yAxisDomain} tick={{ fontSize: 12 }} stroke="#666" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="qty" radius={[4, 4, 0, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? "#DDECFD" : "#F0F1F4"}
                stroke={activeIndex === index ? "#DDECFD" : "#F0F1F4"}
                strokeWidth={1}
              />
            ))}
          </Bar>
          <Line
            type="linear"
            dataKey="qty"
            stroke="#669BD2"
            strokeWidth={4}
            dot={{ fill: "#669BD2", r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ItemMovementChart;
