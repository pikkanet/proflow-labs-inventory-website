import axios from "axios";

// TODO: Move to .env
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 30000,
});
export default axiosInstance;
