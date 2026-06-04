import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("authUser");

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser?.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

export default axiosInstance;