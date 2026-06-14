const axios = require("axios");

const PYTHON_MODEL_URL =
  process.env.PYTHON_MODEL_URL || "http://localhost:8000";

const analyzeStudentInteraction = async (payload) => {
  const response = await axios.post(`${PYTHON_MODEL_URL}/analyze`, payload, {
    timeout: 15000,
  });

  return response.data;
};

const updateQReward = async (payload) => {
  const response = await axios.post(`${PYTHON_MODEL_URL}/reward`, payload, {
    timeout: 15000,
  });

  return response.data;
};

module.exports = {
  analyzeStudentInteraction,
  updateQReward,
};