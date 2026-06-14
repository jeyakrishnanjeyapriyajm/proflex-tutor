import axiosInstance from "../../api/axiosInstance";

export const getCurriculumModules = async () => {
  const { data } = await axiosInstance.get("/curriculum");
  return data;
};

export const getModuleById = async (moduleId) => {
  const { data } = await axiosInstance.get(`/curriculum/${moduleId}`);
  return data;
};