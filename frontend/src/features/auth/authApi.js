import axiosInstance from "../../api/axiosInstance";

export const registerUserApi = async (payload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data;
};

export const loginUserApi = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const getProfileApi = async () => {
  const { data } = await axiosInstance.get("/auth/profile");
  return data;
};