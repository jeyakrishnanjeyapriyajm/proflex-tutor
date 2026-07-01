import axiosInstance from "./api";

export const getMessageStudents = async () => {
  const response = await axiosInstance.get("/messages/students");
  return response.data;
};

export const getSentMessages = async () => {
  const response = await axiosInstance.get("/messages/sent");
  return response.data;
};

export const sendMessage = async (payload) => {
  const response = await axiosInstance.post("/messages/send", payload);
  return response.data;
};

export const getMyMessages = async () => {
  const response = await axiosInstance.get("/messages/my");
  return response.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await axiosInstance.patch(`/messages/${messageId}/read`);
  return response.data;
};

export const replyMessage = async (messageId, body) => {
  const response = await axiosInstance.post(`/messages/${messageId}/reply`, {
    body,
  });

  return response.data;
};