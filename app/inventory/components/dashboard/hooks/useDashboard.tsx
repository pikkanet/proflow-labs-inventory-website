import { useEffect, useState } from "react";
import axiosInstance from "@/app/shared/services/axiosInstance";
import Swal from "sweetalert2";
import { useRefresh } from "@/app/contexts/RefreshContext";
import { IDashboard, IDashboardResponse } from "../../../types/dashboard";
import { AxiosError } from "axios";

const useDashboard = () => {
  const [data, setData] = useState<IDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshKey } = useRefresh();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get<IDashboardResponse>(
          "/dashboard"
        );
        const { data, status } = response;
        if (status !== 200) {
          throw new Error(data.message);
        }

        const result = data.data;
        setData(result);
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorStatus = error.response?.status;
          if (errorStatus === 401) {
            return;
          }
        }
        setError(error instanceof Error ? error.message : "An error occurred");

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

  return { data, loading, error };
};

export default useDashboard;
