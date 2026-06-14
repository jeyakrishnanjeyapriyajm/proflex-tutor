const express = require("express");
const { updateSupportReward } = require("../controllers/modelRewardController");
const { protect } = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/support-reward", protect, updateSupportReward);

module.exports = router;