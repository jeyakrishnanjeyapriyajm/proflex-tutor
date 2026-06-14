const DecisionLog = require("../models/DecisionLog");
const { updateQReward } = require("../services/pythonModelService");

const updateSupportReward = async (req, res) => {
  try {
    const { decisionLogId, reward, nextState } = req.body;

    const decisionLog = await DecisionLog.findById(decisionLogId);

    if (!decisionLog) {
      return res.status(404).json({
        success: false,
        message: "Decision log not found",
      });
    }

    const payload = {
      q_state: decisionLog.qState,
      q_action: decisionLog.qAction,
      reward: Number(reward),
      next_state: nextState || decisionLog.qState,
    };

    const result = await updateQReward(payload);

    decisionLog.reward = Number(reward);
    decisionLog.status = "reward_updated";
    decisionLog.pythonRawResponse = {
      ...decisionLog.pythonRawResponse,
      rewardUpdate: result,
    };

    await decisionLog.save();

    return res.status(200).json({
      success: true,
      message: "Reward updated successfully",
      result,
    });
  } catch (error) {
    console.error("UPDATE SUPPORT REWARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update reward",
      error: error.message,
    });
  }
};

module.exports = {
  updateSupportReward,
};