import axios from "axios";

// TODO: Move to .env
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
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

export default axiosInstance;
