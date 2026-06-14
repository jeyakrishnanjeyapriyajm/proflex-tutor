const axios = require("axios");

const getPythonUrl = () => {
  const pythonUrl = process.env.PYTHON_MODEL_URL;

  if (!pythonUrl) {
    throw new Error("PYTHON_MODEL_URL is missing in .env");
  }

  return pythonUrl;
};

const callPythonDifficultyModel = async (payload) => {
  const pythonUrl = getPythonUrl();

  const response = await axios.post(`${pythonUrl}/analyze`, payload, {
    timeout: 15000,
  });

  return response.data;
};

const callPythonRewardModel = async (payload) => {
  const pythonUrl = getPythonUrl();

  const response = await axios.post(`${pythonUrl}/reward`, payload, {
    timeout: 15000,
  });

  return response.data;
};

module.exports = {
  callPythonDifficultyModel,
  callPythonRewardModel,
};