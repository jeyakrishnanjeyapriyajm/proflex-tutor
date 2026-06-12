import axiosInstance from "../api/axiosInstance";

export const getStudentDashboard = async () => {
  const { data } = await axiosInstance.get("/user/student-dashboard");
  return data;
};

export const getStudentAnalytics = async () => {
  const { data } = await axiosInstance.get("/user/student-analytics");
  return data;
};

export const getStudentWorkspace = async () => {
  const { data } = await axiosInstance.get("/user/student-workspace");
  return data;
};

export const getStudentCurriculum = async () => {
  const { data } = await axiosInstance.get("/user/student-curriculum");
  return data;
};

export const getStudentAssessment = async () => {
  const { data } = await axiosInstance.get("/user/student-assessment");
  return data;
};

export const getStudentResources = async () => {
  const { data } = await axiosInstance.get("/user/student-resources");
  return data;
};

export const getStudentMessages = async () => {
  const { data } = await axiosInstance.get("/user/student-messages");
  return data;
};

export const getStudentSettings = async () => {
  const { data } = await axiosInstance.get("/user/student-settings");
  return data;
};