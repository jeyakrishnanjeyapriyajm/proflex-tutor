import API from "./api";


export const getMyAnalysisOverview = async () => {
  const response = await API.get("/student-analysis/overview");
  return response.data;
};

export const getMyModuleAnalysis = async (moduleId) => {
  const response = await API.get(
    `/student-analysis/modules/${moduleId}`
  );

  return response.data;
};