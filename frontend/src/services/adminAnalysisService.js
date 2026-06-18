import API from "./api";

export const getAnalysisOverview = async () => {
  const response = await API.get("/analysis/overview");
  return response.data;
};

export const getModuleAnalysis = async (moduleId) => {
  const response = await API.get(`/analysis/modules/${moduleId}`);
  return response.data;
};