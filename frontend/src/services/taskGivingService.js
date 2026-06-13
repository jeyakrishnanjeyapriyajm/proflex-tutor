import API from "./api";

export const getTaskModules = async () => {
  const { data } = await API.get("/task-giving/modules");
  return data;
};

export const startTaskModule = async (moduleId) => {
  const { data } = await API.post(`/task-giving/modules/${moduleId}/start`);
  return data;
};

export const getCurrentTask = async (moduleId) => {
  const { data } = await API.get(
    `/task-giving/modules/${moduleId}/current-task`,
  );
  return data;
};

export const submitTaskAnswer = async (payload) => {
  const { data } = await API.post("/task-giving/submit", payload);
  return data;
};

export const runDifficultyAnalysis = async (payload) => {
  const { data } = await API.post("/task-giving/difficulty-analysis", payload);
  return data;
};

export const submitSuggestedRoundResult = async (payload) => {
  const res = await api.post("/student/suggested-round-result", payload);
  return res.data;
};
