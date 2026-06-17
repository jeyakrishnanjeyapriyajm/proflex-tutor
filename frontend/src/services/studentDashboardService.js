import API from "./api";
export const getStudentDashboardSummary = async () => {
  const response = await API.get("/student-dashboard/summary");
  return response.data;
};