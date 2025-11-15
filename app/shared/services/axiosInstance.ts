import axios from "axios";
import Swal from "sweetalert2";
import { clearAuthData } from "../utils/auth";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "Your session has expired. Please login again.",
        confirmButtonText: "Go to Login",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((result) => {
        if (result.isConfirmed) {
          clearAuthData();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
