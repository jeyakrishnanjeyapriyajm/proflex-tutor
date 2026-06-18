import API from "./api";

export const getAdminAnalysisOverview = async () => {
  const response = await API.get("/analysis/overview");
  return response.data;
};

export const getAdminModuleAnalysis = async (moduleId) => {
  const response = await API.get(`/analysis/modules/${moduleId}`);
  return response.data;
};