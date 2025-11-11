"use client";

import { useEffect, useState } from "react";

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
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center align-center">
        <p className="w-1/4">Total Items: {data.totalItems}</p>
        <p className="w-1/4">Total Quantity: {data.totalQuantity}</p>
        <p className="w-1/4">Low Stock: {data.lowStock}</p>
        <p className="w-1/4">Out of Stock: {data.outOfStock}</p>
      </div>
    </div>
  );
};

export default Dashboard;
