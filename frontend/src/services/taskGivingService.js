import axiosInstance from "../api/axiosInstance";

export const getTaskModules = async () => {
  const response = await axiosInstance.get("/task-giving/modules");
  return response.data;
};

export const startTaskModule = async (moduleId) => {
  const response = await axiosInstance.post(`/task-giving/start/${moduleId}`);
  return response.data;
};

export const getCurrentTask = async (moduleId) => {
  const response = await axiosInstance.get(`/task-giving/current/${moduleId}`);
  return response.data;
};

export const submitTaskAnswer = async (payload) => {
  const response = await axiosInstance.post("/task-giving/submit", payload);
  return response.data;
};

const taskGivingService = {
  getTaskModules,
  startTaskModule,
  getCurrentTask,
  submitTaskAnswer,
};

export default taskGivingService;