import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(
  (config) => {
    const savedAuth = JSON.parse(localStorage.getItem("auth") || "{}");

    const token = savedAuth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
