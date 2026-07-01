import axiosInstance from "../api/axiosInstance";

export const runCCode = async (code) => {
  const response = await axiosInstance.post("/compiler/run", {
    code,
  });

  return response.data;
};