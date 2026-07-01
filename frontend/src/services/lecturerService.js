import API from "./api";

export const getLecturerOverview = async () => {
  const response = await API.get("/lecturer/overview");
  return response.data;
};

export const getLecturerStudents = async () => {
  const response = await API.get("/lecturer/students");
  return response.data;
};

export const getLecturerAnalytics = async () => {
  const response = await API.get("/lecturer/analytics");
  return response.data;
};

export const getLecturerContent = async () => {
  const response = await API.get("/lecturer/content");
  return response.data;
};

export const getLecturerQuestionBank = async (params = {}) => {
  const response = await API.get("/lecturer/question-bank", {
    params,
  });

  return response.data;
};

export const createLecturerQuestion = async (payload) => {
  const response = await API.post("/lecturer/question-bank", payload);
  return response.data;
};