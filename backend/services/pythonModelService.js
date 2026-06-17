const axios = require("axios");

const PYTHON_MODEL_URL =
  process.env.PYTHON_MODEL_URL || "http://localhost:8000";
console.log("Python URL:", PYTHON_MODEL_URL);
const analyzeStudentInteraction = async (payload) => {
  try {
    const response = await axios.post(
      `${PYTHON_MODEL_URL}/analyze`,
      payload,
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Python model returned invalid response");
    }

    return response.data;
  } catch (error) {
    console.error("PYTHON ANALYZE SERVICE ERROR:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to analyze student interaction"
    );
  }
};

const updateQReward = async (payload) => {
  try {
    const response = await axios.post(
      `${PYTHON_MODEL_URL}/reward`,
      payload,
      {
        timeout: 15000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Python reward endpoint returned invalid response");
    }

    return response.data;
  } catch (error) {
    console.error("PYTHON REWARD SERVICE ERROR:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Message:", error.message);
    }

    throw new Error(
      error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to update Q-learning reward"
    );
  }
};

module.exports = {
  analyzeStudentInteraction,
  updateQReward,
};
