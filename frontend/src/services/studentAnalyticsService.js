import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("studentToken")
  );
};

export const getStudentAnalytics = async () => {
  const token = getToken();

  const response = await axios.get(`${API_URL}/student/analytics`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  return response.data;
};