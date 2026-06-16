import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add token from localStorage auth object
axiosInstance.interceptors.request.use(
  (config) => {
    const savedAuth = JSON.parse(localStorage.getItem("auth") || "{}");

    const token =
      savedAuth?.token ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
