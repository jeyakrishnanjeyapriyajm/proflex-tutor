import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getStudentAnalytics = async () => {
  const response = await axios.get(
    `${API_URL}/student/analytics`,
    getAuthHeaders()
  );

  return response.data;
};