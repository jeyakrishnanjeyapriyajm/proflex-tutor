import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("studentToken")
  );
};

const getAuthHeaders = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
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